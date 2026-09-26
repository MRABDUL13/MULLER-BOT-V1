const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mp3',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.mp3',
  execute: createExecutor('mp3', 'audio', 'Audio processing utility.')
};
