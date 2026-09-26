const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'blackjack',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.blackjack',
  execute: createExecutor('blackjack', 'games', 'Game command.')
};
