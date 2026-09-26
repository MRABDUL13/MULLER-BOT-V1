const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'blur',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.blur',
  execute: createExecutor('blur', 'image', 'Image processing utility.')
};
