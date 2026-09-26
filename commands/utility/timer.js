const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'timer',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.timer',
  execute: createExecutor('timer', 'utility', 'General utility tool.')
};
