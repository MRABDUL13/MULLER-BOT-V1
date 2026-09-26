const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'sepia',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.sepia',
  execute: createExecutor('sepia', 'image', 'Image processing utility.')
};
