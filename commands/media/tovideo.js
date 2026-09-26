const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'tovideo',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.tovideo',
  execute: createExecutor('tovideo', 'media', 'Media processing utility.')
};
