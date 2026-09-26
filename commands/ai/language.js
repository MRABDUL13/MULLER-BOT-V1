const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'language',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.language',
  execute: createExecutor('language', 'ai', 'AI assistant command.')
};
