const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'tic',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.tic',
  execute: createExecutor('tic', 'games', 'Game command.')
};
