const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'speedup',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.speedup',
  execute: createExecutor('speedup', 'audio', 'Audio processing utility.')
};
