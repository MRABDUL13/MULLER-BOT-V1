const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'math',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.math',
  execute: createExecutor('math', 'utility', 'General utility tool.')
};
