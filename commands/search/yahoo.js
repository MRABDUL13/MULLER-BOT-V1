const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'yahoo',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.yahoo',
  execute: createExecutor('yahoo', 'search', 'Web/search utility.')
};
