const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'tac',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.tac',
  execute: createExecutor('tac', 'games', 'Game command.')
};
