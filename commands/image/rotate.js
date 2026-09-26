const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'rotate',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.rotate',
  execute: createExecutor('rotate', 'image', 'Image processing utility.')
};
