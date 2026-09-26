const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'sticker2',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.sticker2',
  execute: createExecutor('sticker2', 'media', 'Media processing utility.')
};
