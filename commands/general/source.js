const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'source',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.source',
  execute: createExecutor('source', 'general', 'General bot information and utility command.')
};
