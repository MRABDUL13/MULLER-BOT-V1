const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'higherlower',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.higherlower',
  execute: createExecutor('higherlower', 'games', 'Game command.')
};
