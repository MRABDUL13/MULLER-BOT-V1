const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'morningdua',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.morningdua',
  execute: createExecutor('morningdua', 'islamic', 'Islamic information/utility command.')
};
