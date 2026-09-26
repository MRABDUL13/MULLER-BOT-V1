const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'stickername',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.stickername',
  execute: createExecutor('stickername', 'media', 'Media processing utility.')
};
