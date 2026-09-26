const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mode',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.mode',
  execute: createExecutor('mode', 'general', 'General bot information and utility command.')
};
