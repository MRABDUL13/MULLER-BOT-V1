const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'audiosplit',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.audiosplit',
  execute: createExecutor('audiosplit', 'audio', 'Audio processing utility.')
};
