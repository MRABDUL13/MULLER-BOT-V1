const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'myinfo',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.myinfo',
  execute: createExecutor('myinfo', 'general', 'General bot information and utility command.')
};
