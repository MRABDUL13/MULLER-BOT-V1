const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'hangman',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.hangman',
  execute: createExecutor('hangman', 'games', 'Game command.')
};
