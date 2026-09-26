const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'meme2',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.meme2',
  execute: createExecutor('meme2', 'media', 'Media processing utility.')
};
