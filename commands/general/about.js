const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'about',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.about',
  execute: createExecutor('about', 'general', 'General bot information and utility command.')
};
