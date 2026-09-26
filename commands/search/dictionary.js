const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'dictionary',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.dictionary',
  execute: createExecutor('dictionary', 'search', 'Web/search utility.')
};
