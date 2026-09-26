const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mathgame',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.mathgame',
  execute: createExecutor('mathgame', 'games', 'Game command.')
};
