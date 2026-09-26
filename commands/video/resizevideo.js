const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'resizevideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.resizevideo',
  execute: createExecutor('resizevideo', 'video', 'Video processing utility.')
};
