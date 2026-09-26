const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'ping2',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.ping2',
  execute: createExecutor('ping2', 'general', 'General bot information and utility command.')
};
