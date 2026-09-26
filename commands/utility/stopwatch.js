const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'stopwatch',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.stopwatch',
  execute: createExecutor('stopwatch', 'utility', 'General utility tool.')
};
