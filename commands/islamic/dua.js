const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'dua',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.dua',
  execute: createExecutor('dua', 'islamic', 'Islamic information/utility command.')
};
