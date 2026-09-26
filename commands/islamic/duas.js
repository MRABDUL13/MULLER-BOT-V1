const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'duas',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.duas',
  execute: createExecutor('duas', 'islamic', 'Islamic information/utility command.')
};
