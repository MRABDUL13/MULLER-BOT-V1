const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'cartoon',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.cartoon',
  execute: createExecutor('cartoon', 'image', 'Image processing utility.')
};
