const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'pitch',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.pitch',
  execute: createExecutor('pitch', 'audio', 'Audio processing utility.')
};
