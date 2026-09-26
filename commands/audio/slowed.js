const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'slowed',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.slowed',
  execute: createExecutor('slowed', 'audio', 'Audio processing utility.')
};
