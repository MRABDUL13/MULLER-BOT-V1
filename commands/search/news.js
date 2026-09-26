const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'news',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.news',
  execute: createExecutor('news', 'search', 'Web/search utility.')
};
