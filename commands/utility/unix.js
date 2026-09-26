const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'unix',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.unix',
  execute: createExecutor('unix', 'utility', 'General utility tool.')
};
