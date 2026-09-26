const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'story',
  aliases: [],
  category: 'ai',
  description: 'AI assistant command.',
  usage: '.story',
  execute: createExecutor('story', 'ai', 'AI assistant command.')
};
