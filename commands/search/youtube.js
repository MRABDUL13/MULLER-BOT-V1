const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'youtube',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.youtube',
  execute: createExecutor('youtube', 'search', 'Web/search utility.')
};
