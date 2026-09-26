const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'stackoverflow',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.stackoverflow',
  execute: createExecutor('stackoverflow', 'search', 'Web/search utility.')
};
