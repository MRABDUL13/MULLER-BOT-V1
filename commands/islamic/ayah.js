const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'ayah',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.ayah',
  execute: createExecutor('ayah', 'islamic', 'Islamic information/utility command.')
};
