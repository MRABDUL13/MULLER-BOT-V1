const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'agecalc',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.agecalc',
  execute: createExecutor('agecalc', 'utility', 'General utility tool.')
};
