const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'resize',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.resize',
  execute: createExecutor('resize', 'image', 'Image processing utility.')
};
