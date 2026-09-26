const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'countdown',
  aliases: [],
  category: 'utility',
  description: 'General utility tool.',
  usage: '.countdown',
  execute: createExecutor('countdown', 'utility', 'General utility tool.')
};
