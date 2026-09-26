const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'guessword',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.guessword',
  execute: createExecutor('guessword', 'games', 'Game command.')
};
