const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'bug',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.bug',
  execute: createExecutor('bug', 'general', 'General bot information and utility command.')
};
