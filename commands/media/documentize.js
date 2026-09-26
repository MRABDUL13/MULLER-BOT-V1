const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'documentize',
  aliases: [],
  category: 'media',
  description: 'Media processing utility.',
  usage: '.documentize',
  execute: createExecutor('documentize', 'media', 'Media processing utility.')
};
