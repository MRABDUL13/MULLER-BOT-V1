const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'volume',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.volume',
  execute: createExecutor('volume', 'audio', 'Audio processing utility.')
};
