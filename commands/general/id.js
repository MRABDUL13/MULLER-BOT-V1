const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'id',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.id',
  execute: createExecutor('id', 'general', 'General bot information and utility command.')
};
