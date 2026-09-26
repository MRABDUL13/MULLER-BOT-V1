const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'summarize',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.summarize',
  execute: createExecutor('summarize', 'ai', 'AI assistant command.')
};
