const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'poker21',
  aliases: [],
  category: 'games',
  description: 'Game command.',
  usage: '.poker21',
  execute: createExecutor('poker21', 'games', 'Game command.')
};
