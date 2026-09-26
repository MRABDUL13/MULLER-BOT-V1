const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'islamicdate',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.islamicdate',
  execute: createExecutor('islamicdate', 'islamic', 'Islamic information/utility command.')
};
