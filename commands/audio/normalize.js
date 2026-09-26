const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'normalize',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.normalize',
  execute: createExecutor('normalize', 'audio', 'Audio processing utility.')
};
