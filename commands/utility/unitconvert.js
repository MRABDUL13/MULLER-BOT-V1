const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'unitconvert',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.unitconvert',
  execute: createExecutor('unitconvert', 'utility', 'General utility tool.')
};
