const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'reverse',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.reverse',
  execute: createExecutor('reverse', 'audio', 'Audio processing utility.')
};
