const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'saturate',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.saturate',
  execute: createExecutor('saturate', 'image', 'Image processing utility.')
};
