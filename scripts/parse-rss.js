const Parser = require('rss-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const parser = new Parser();

async function fetchAndParseWithAxios(url) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept': 'application/rss+xml,application/xml',
    },
    responseType: 'text',
  });
  return parser.parseString(response.data);
}

(async () => {
  const feedsDir = './feeds';
  const outputDir = './docs';

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const yamlFiles = fs.readdirSync(feedsDir).filter(file => file.endsWith('.yaml'));

  for (const file of yamlFiles) {
    const yamlPath = path.join(feedsDir, file);
    const config = yaml.load(fs.readFileSync(yamlPath, 'utf8'));

    const allItems = [];
    for (const url of config.feeds) {
      try {
        const feed = url.includes('woowahan.com')
          ? await fetchAndParseWithAxios(url)
          : await parser.parseURL(url);

        allItems.push(...feed.items.slice(0, 10));
      } catch (err) {
        console.error(`❌ ${url} 파싱 실패: ${err.message}`);
      }
    }

    const outputFile = path.join(outputDir, file.replace('.yaml', '.json'));
    fs.writeFileSync(outputFile, JSON.stringify(allItems, null, 2));
    console.log(`✅ 생성 완료: ${outputFile}`);
  }
})();
