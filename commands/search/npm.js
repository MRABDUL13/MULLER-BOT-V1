const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'npm',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.npm',
  execute: createExecutor('npm', 'search', 'Web/search utility.')
};
