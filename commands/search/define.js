const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'define',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.define',
  execute: createExecutor('define', 'search', 'Web/search utility.')
};
