const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'calculate',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.calculate',
  execute: createExecutor('calculate', 'utility', 'General utility tool.')
};
