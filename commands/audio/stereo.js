const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'stereo',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.stereo',
  execute: createExecutor('stereo', 'audio', 'Audio processing utility.')
};
