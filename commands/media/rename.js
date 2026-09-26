const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'rename',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.rename',
  execute: createExecutor('rename', 'media', 'Media processing utility.')
};
