const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'timeconvert',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.timeconvert',
  execute: createExecutor('timeconvert', 'utility', 'General utility tool.')
};
