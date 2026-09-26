const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'topdf',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.topdf',
  execute: createExecutor('topdf', 'media', 'Media processing utility.')
};
