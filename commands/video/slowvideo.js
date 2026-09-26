const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'slowvideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.slowvideo',
  execute: createExecutor('slowvideo', 'video', 'Video processing utility.')
};
