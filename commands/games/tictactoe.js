const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'tictactoe',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.tictactoe',
  execute: createExecutor('tictactoe', 'games', 'Game command.')
};
