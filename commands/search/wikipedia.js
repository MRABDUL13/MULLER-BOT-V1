const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'wikipedia',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.wikipedia',
  execute: createExecutor('wikipedia', 'search', 'Web/search utility.')
};
