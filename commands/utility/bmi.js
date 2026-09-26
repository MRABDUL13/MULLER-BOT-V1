const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'bmi',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.bmi',
  execute: createExecutor('bmi', 'utility', 'General utility tool.')
};
