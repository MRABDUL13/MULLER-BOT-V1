const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'sharpen',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.sharpen',
  execute: createExecutor('sharpen', 'image', 'Image processing utility.')
};
