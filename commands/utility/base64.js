const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'base64',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.base64',
  execute: createExecutor('base64', 'utility', 'General utility tool.')
};
