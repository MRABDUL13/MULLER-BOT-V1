const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'trimvideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.trimvideo',
  execute: createExecutor('trimvideo', 'video', 'Video processing utility.')
};
