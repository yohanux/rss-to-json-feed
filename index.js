const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

(async () => {
  const parser = new Parser();
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
        const feed = await parser.parseURL(url);
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
