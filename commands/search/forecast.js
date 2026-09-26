const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'forecast',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.forecast',
  execute: createExecutor('forecast', 'search', 'Web/search utility.')
};
