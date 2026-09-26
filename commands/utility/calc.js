const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'calc',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.calc',
  execute: createExecutor('calc', 'utility', 'General utility tool.')
};
