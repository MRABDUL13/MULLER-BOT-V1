const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mp4',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.mp4',
  execute: createExecutor('mp4', 'video', 'Video processing utility.')
};
