const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'length',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.length',
  execute: createExecutor('length', 'utility', 'General utility tool.')
};
