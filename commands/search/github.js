const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'github',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.github',
  execute: createExecutor('github', 'search', 'Web/search utility.')
};
