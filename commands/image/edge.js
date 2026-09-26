const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'edge',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.edge',
  execute: createExecutor('edge', 'image', 'Image processing utility.')
};
