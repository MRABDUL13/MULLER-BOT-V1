const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'ai',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.ai',
  execute: createExecutor('ai', 'ai', 'AI assistant command.')
};
