const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'wiki',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.wiki',
  execute: createExecutor('wiki', 'search', 'Web/search utility.')
};
