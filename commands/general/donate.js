const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'donate',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.donate',
  execute: createExecutor('donate', 'general', 'General bot information and utility command.')
};
