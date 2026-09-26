const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'pixelate',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.pixelate',
  execute: createExecutor('pixelate', 'image', 'Image processing utility.')
};
