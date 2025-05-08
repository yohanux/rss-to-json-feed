const Parser = require('rss-parser');
const fs = require('fs');
const yaml = require('js-yaml');

(async () => {
  const parser = new Parser();

  // feeds.yaml 읽기
  const config = yaml.load(fs.readFileSync('./toss.yaml', 'utf8'));
  const result = [];

  for (const url of config.feeds) {
    try {
      const feed = await parser.parseURL(url);
      result.push({
        title: feed.title,
        url,
        items: feed.items.slice(0, 10),
      });
    } catch (err) {
      console.error(`❌ ${url} 파싱 실패: ${err.message}`);
    }
  }

  // docs 폴더가 없다면 생성
  if (!fs.existsSync('docs')) {
    fs.mkdirSync('docs');
  }

  fs.writeFileSync('docs/toss.json', JSON.stringify(result, null, 2));
  console.log('✅ JSON 생성 완료: docs/feed.json');
})();
