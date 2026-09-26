const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'compressmedia',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.compressmedia',
  execute: createExecutor('compressmedia', 'media', 'Media processing utility.')
};
