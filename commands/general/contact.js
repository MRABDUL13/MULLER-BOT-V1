const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'contact',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.contact',
  execute: createExecutor('contact', 'general', 'General bot information and utility command.')
};
