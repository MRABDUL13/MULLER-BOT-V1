const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mergeaudio',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.mergeaudio',
  execute: createExecutor('mergeaudio', 'audio', 'Audio processing utility.')
};
