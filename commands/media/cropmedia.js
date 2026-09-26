const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'cropmedia',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.cropmedia',
  execute: createExecutor('cropmedia', 'media', 'Media processing utility.')
};
