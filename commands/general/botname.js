const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'botname',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.botname',
  execute: createExecutor('botname', 'general', 'General bot information and utility command.')
};
