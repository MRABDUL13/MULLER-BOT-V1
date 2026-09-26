const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'cutaudio',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.cutaudio',
  execute: createExecutor('cutaudio', 'audio', 'Audio processing utility.')
};
