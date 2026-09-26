const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'translateai',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.translateai',
  execute: createExecutor('translateai', 'ai', 'AI assistant command.')
};
