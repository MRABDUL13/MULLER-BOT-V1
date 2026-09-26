const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'wordle',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.wordle',
  execute: createExecutor('wordle', 'games', 'Game command.')
};
