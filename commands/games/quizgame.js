const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'quizgame',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.quizgame',
  execute: createExecutor('quizgame', 'games', 'Game command.')
};
