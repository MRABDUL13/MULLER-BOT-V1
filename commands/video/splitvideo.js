const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'splitvideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.splitvideo',
  execute: createExecutor('splitvideo', 'video', 'Video processing utility.')
};
