const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'toimage',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.toimage',
  execute: createExecutor('toimage', 'media', 'Media processing utility.')
};
