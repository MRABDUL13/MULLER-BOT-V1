const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'timestamp',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.timestamp',
  execute: createExecutor('timestamp', 'utility', 'General utility tool.')
};
