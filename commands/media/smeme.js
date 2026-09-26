const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'smeme',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.smeme',
  execute: createExecutor('smeme', 'media', 'Media processing utility.')
};
