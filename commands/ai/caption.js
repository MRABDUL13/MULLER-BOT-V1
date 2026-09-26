const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'caption',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.caption',
  execute: createExecutor('caption', 'ai', 'AI assistant command.')
};
