const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'currency',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.currency',
  execute: createExecutor('currency', 'utility', 'General utility tool.')
};
