const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'stickerwm',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.stickerwm',
  execute: createExecutor('stickerwm', 'media', 'Media processing utility.')
};
