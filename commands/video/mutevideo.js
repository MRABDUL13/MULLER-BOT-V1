const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mutevideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.mutevideo',
  execute: createExecutor('mutevideo', 'video', 'Video processing utility.')
};
