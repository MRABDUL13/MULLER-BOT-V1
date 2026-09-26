const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'translate',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.translate',
  execute: createExecutor('translate', 'search', 'Web/search utility.')
};
