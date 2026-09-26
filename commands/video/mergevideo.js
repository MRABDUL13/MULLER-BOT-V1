const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mergevideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.mergevideo',
  execute: createExecutor('mergevideo', 'video', 'Video processing utility.')
};
