const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'videosticker',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.videosticker',
  execute: createExecutor('videosticker', 'media', 'Media processing utility.')
};
