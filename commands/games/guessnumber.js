const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'guessnumber',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.guessnumber',
  execute: createExecutor('guessnumber', 'games', 'Game command.')
};
