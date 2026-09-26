const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'tasbih',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.tasbih',
  execute: createExecutor('tasbih', 'islamic', 'Islamic information/utility command.')
};
