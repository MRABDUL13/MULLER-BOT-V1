const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'prefix',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.prefix',
  execute: createExecutor('prefix', 'general', 'General bot information and utility command.')
};
