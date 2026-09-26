const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'status',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.status',
  execute: createExecutor('status', 'general', 'General bot information and utility command.')
};
