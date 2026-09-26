const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'support',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.support',
  execute: createExecutor('support', 'general', 'General bot information and utility command.')
};
