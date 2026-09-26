const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'allah',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.allah',
  execute: createExecutor('allah', 'islamic', 'Islamic information/utility command.')
};
