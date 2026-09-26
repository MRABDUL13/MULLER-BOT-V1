const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'grammar',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.grammar',
  execute: createExecutor('grammar', 'ai', 'AI assistant command.')
};
