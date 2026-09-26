const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'memory',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.memory',
  execute: createExecutor('memory', 'games', 'Game command.')
};
