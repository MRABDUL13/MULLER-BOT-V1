const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'sentiment',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.sentiment',
  execute: createExecutor('sentiment', 'ai', 'AI assistant command.')
};
