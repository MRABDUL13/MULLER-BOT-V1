const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'correct',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.correct',
  execute: createExecutor('correct', 'ai', 'AI assistant command.')
};
