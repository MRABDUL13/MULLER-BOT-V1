const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'cropvideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.cropvideo',
  execute: createExecutor('cropvideo', 'video', 'Video processing utility.')
};
