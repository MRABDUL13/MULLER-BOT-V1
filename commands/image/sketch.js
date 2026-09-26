const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'sketch',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.sketch',
  execute: createExecutor('sketch', 'image', 'Image processing utility.')
};
