const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'temperature',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.temperature',
  execute: createExecutor('temperature', 'utility', 'General utility tool.')
};
