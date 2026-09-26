const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'take',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.take',
  execute: createExecutor('take', 'media', 'Media processing utility.')
};
