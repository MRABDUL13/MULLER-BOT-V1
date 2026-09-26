const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'wav',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.wav',
  execute: createExecutor('wav', 'audio', 'Audio processing utility.')
};
