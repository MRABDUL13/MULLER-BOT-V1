const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'cutvideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.cutvideo',
  execute: createExecutor('cutvideo', 'video', 'Video processing utility.')
};
