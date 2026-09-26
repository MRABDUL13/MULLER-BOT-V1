const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'percentage',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.percentage',
  execute: createExecutor('percentage', 'utility', 'General utility tool.')
};
