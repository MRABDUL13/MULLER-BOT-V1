const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'explain',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.explain',
  execute: createExecutor('explain', 'ai', 'AI assistant command.')
};
