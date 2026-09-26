const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'detect',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.detect',
  execute: createExecutor('detect', 'ai', 'AI assistant command.')
};
