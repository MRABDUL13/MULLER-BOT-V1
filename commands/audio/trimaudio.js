const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'trimaudio',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.trimaudio',
  execute: createExecutor('trimaudio', 'audio', 'Audio processing utility.')
};
