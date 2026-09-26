const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'sketch2',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.sketch2',
  execute: createExecutor('sketch2', 'image', 'Image processing utility.')
};
