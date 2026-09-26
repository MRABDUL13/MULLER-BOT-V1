const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'toaudio',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.toaudio',
  execute: createExecutor('toaudio', 'media', 'Media processing utility.')
};
