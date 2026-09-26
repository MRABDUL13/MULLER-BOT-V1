const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'ideas',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.ideas',
  execute: createExecutor('ideas', 'ai', 'AI assistant command.')
};
