const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'stickerpack',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.stickerpack',
  execute: createExecutor('stickerpack', 'media', 'Media processing utility.')
};
