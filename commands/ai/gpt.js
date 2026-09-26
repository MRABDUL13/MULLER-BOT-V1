const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'gpt',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.gpt',
  execute: createExecutor('gpt', 'ai', 'AI assistant command.')
};
