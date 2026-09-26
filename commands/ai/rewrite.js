const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'rewrite',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.rewrite',
  execute: createExecutor('rewrite', 'ai', 'AI assistant command.')
};
