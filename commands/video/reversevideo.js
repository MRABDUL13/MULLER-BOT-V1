const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'reversevideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.reversevideo',
  execute: createExecutor('reversevideo', 'video', 'Video processing utility.')
};
