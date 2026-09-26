const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'riddles2',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.riddles2',
  execute: createExecutor('riddles2', 'games', 'Game command.')
};
