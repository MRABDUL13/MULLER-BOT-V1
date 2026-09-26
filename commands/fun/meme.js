const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'meme',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.meme',
  execute: createExecutor('meme', 'fun', 'Fun and entertainment command.')
};
