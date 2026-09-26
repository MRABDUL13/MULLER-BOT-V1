const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'jid',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.jid',
  execute: createExecutor('jid', 'general', 'General bot information and utility command.')
};
