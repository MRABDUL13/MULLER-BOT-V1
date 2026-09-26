const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'flip',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.flip',
  execute: createExecutor('flip', 'image', 'Image processing utility.')
};
