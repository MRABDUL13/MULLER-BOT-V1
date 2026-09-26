const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'chat',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.chat',
  execute: createExecutor('chat', 'ai', 'AI assistant command.')
};
