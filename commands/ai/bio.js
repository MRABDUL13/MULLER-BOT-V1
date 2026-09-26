const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'bio',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.bio',
  execute: createExecutor('bio', 'ai', 'AI assistant command.')
};
