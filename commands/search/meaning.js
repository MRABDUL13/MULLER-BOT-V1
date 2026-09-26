const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'meaning',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.meaning',
  execute: createExecutor('meaning', 'search', 'Web/search utility.')
};
