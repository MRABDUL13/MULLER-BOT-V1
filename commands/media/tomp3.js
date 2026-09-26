const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'tomp3',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.tomp3',
  execute: createExecutor('tomp3', 'media', 'Media processing utility.')
};
