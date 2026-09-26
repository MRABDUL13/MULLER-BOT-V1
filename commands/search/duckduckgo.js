const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'duckduckgo',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.duckduckgo',
  execute: createExecutor('duckduckgo', 'search', 'Web/search utility.')
};
