const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'invert',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.invert',
  execute: createExecutor('invert', 'image', 'Image processing utility.')
};
