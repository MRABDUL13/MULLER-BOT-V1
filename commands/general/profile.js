const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'profile',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.profile',
  execute: createExecutor('profile', 'general', 'General bot information and utility command.')
};
