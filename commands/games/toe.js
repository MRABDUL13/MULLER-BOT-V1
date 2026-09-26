const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'toe',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.toe',
  execute: createExecutor('toe', 'games', 'Game command.')
};
