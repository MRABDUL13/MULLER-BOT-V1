const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'translate2',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.translate2',
  execute: createExecutor('translate2', 'search', 'Web/search utility.')
};
