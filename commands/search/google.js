const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'google',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.google',
  execute: createExecutor('google', 'search', 'Web/search utility.')
};
