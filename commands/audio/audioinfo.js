const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'audioinfo',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.audioinfo',
  execute: createExecutor('audioinfo', 'audio', 'Audio processing utility.')
};
