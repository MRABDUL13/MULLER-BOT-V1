const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'enhance',
  aliases: [],
  category: 'image',
  description: 'Image processing utility.',
  usage: '.enhance',
  execute: createExecutor('enhance', 'image', 'Image processing utility.')
};
