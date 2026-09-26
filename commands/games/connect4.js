const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'connect4',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.connect4',
  execute: createExecutor('connect4', 'games', 'Game command.')
};
