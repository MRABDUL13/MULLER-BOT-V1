const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'trivia2',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.trivia2',
  execute: createExecutor('trivia2', 'games', 'Game command.')
};
