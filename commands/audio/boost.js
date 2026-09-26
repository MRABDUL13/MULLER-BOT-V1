const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'boost',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.boost',
  execute: createExecutor('boost', 'audio', 'Audio processing utility.')
};
