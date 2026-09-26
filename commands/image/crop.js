const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'crop',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.crop',
  execute: createExecutor('crop', 'image', 'Image processing utility.')
};
