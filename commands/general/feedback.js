const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'feedback',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.feedback',
  execute: createExecutor('feedback', 'general', 'General bot information and utility command.')
};
