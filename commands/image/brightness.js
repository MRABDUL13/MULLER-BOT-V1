const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'brightness',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.brightness',
  execute: createExecutor('brightness', 'image', 'Image processing utility.')
};
