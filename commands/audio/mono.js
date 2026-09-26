const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mono',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.mono',
  execute: createExecutor('mono', 'audio', 'Audio processing utility.')
};
