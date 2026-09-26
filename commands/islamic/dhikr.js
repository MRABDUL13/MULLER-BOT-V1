const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'dhikr',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.dhikr',
  execute: createExecutor('dhikr', 'islamic', 'Islamic information/utility command.')
};
