const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'videoinfo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.videoinfo',
  execute: createExecutor('videoinfo', 'video', 'Video processing utility.')
};
