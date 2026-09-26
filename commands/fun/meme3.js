const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'meme3',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.meme3',
  execute: createExecutor('meme3', 'fun', 'Fun and entertainment command.')
};
