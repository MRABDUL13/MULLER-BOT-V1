const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'grayscale',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.grayscale',
  execute: createExecutor('grayscale', 'image', 'Image processing utility.')
};
