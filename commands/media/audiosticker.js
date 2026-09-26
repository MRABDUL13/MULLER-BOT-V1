const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'audiosticker',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.audiosticker',
  execute: createExecutor('audiosticker', 'media', 'Media processing utility.')
};
