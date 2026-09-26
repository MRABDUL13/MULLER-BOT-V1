const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'percent',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.percent',
  execute: createExecutor('percent', 'utility', 'General utility tool.')
};
