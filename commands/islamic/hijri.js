const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'hijri',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.hijri',
  execute: createExecutor('hijri', 'islamic', 'Islamic information/utility command.')
};
