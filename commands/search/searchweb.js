const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'searchweb',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.searchweb',
  execute: createExecutor('searchweb', 'search', 'Web/search utility.')
};
