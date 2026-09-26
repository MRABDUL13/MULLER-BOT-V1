const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mirror',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.mirror',
  execute: createExecutor('mirror', 'image', 'Image processing utility.')
};
