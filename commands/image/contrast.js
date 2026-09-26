const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'contrast',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.contrast',
  execute: createExecutor('contrast', 'image', 'Image processing utility.')
};
