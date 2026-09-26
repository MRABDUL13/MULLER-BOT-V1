const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'lyrics2',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.lyrics2',
  execute: createExecutor('lyrics2', 'audio', 'Audio processing utility.')
};
