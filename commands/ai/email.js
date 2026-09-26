const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'email',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.email',
  execute: createExecutor('email', 'ai', 'AI assistant command.')
};
