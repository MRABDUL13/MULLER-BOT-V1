const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'speedvideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.speedvideo',
  execute: createExecutor('speedvideo', 'video', 'Video processing utility.')
};
