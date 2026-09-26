const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'wordguess',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.wordguess',
  execute: createExecutor('wordguess', 'games', 'Game command.')
};
