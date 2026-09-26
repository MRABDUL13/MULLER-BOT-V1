const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'uptime',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.uptime',
  execute: createExecutor('uptime', 'general', 'General bot information and utility command.')
};
