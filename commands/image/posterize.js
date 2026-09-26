const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'posterize',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.posterize',
  execute: createExecutor('posterize', 'image', 'Image processing utility.')
};
