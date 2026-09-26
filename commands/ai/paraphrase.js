const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'paraphrase',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.paraphrase',
  execute: createExecutor('paraphrase', 'ai', 'AI assistant command.')
};
