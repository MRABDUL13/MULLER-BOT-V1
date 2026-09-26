const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'weather',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.weather',
  execute: createExecutor('weather', 'search', 'Web/search utility.')
};
