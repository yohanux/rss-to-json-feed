const Parser = require('rss-parser');
const fs = require('fs');
const yaml = require('js-yaml');

(async () => {
  const parser = new Parser();
  const config = yaml.load(fs.readFileSync('feeds.yaml', 'utf8'));
  const result = [];

  for (const url of config.feeds) {
    try {
      const feed = await parser.parseURL(url);
      result.push({
        title: feed.title,
        url,
        items: feed.items.slice(0, 10), // 최신 10개만
      });
    } catch (err) {
      console.error(`Failed to parse ${url}: ${err.message}`);
    }
  }

  fs.writeFileSync('docs/feed.json', JSON.stringify(result, null, 2));
})();
