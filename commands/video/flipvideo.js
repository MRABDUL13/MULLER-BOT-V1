const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'flipvideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.flipvideo',
  execute: createExecutor('flipvideo', 'video', 'Video processing utility.')
};
