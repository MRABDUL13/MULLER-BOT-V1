const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'bass',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.bass',
  execute: createExecutor('bass', 'audio', 'Audio processing utility.')
};
