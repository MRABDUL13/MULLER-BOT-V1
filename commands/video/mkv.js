const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mkv',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.mkv',
  execute: createExecutor('mkv', 'video', 'Video processing utility.')
};
