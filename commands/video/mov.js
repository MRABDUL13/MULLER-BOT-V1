const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mov',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.mov',
  execute: createExecutor('mov', 'video', 'Video processing utility.')
};
