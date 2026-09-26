const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'brainstorm',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.brainstorm',
  execute: createExecutor('brainstorm', 'ai', 'AI assistant command.')
};
