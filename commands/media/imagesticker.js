const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'imagesticker',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.imagesticker',
  execute: createExecutor('imagesticker', 'media', 'Media processing utility.')
};
