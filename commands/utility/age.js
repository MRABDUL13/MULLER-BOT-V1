const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'age',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.age',
  execute: createExecutor('age', 'utility', 'General utility tool.')
};
