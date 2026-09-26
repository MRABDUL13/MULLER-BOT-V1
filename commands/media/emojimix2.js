const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'emojimix2',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.emojimix2',
  execute: createExecutor('emojimix2', 'media', 'Media processing utility.')
};
