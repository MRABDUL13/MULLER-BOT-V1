const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'webm',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.webm',
  execute: createExecutor('webm', 'video', 'Video processing utility.')
};
