const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'weight',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.weight',
  execute: createExecutor('weight', 'utility', 'General utility tool.')
};
