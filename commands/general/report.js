const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'report',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.report',
  execute: createExecutor('report', 'general', 'General bot information and utility command.')
};
