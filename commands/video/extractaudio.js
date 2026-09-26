const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'extractaudio',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.extractaudio',
  execute: createExecutor('extractaudio', 'video', 'Video processing utility.')
};
