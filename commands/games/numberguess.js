const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'numberguess',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.numberguess',
  execute: createExecutor('numberguess', 'games', 'Game command.')
};
