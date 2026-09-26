const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'fastvideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.fastvideo',
  execute: createExecutor('fastvideo', 'video', 'Video processing utility.')
};
