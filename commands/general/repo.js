const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'repo',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.repo',
  execute: createExecutor('repo', 'general', 'General bot information and utility command.')
};
