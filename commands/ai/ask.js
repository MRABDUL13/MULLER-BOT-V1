const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'ask',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.ask',
  execute: createExecutor('ask', 'ai', 'AI assistant command.')
};
