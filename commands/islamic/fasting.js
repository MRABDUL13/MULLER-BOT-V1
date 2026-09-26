const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'fasting',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.fasting',
  execute: createExecutor('fasting', 'islamic', 'Islamic information/utility command.')
};
