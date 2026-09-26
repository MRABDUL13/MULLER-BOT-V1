const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'blackjack2',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.blackjack2',
  execute: createExecutor('blackjack2', 'games', 'Game command.')
};
