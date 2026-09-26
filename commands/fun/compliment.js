const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'compliment',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.compliment',
  execute: createExecutor('compliment', 'fun', 'Fun and entertainment command.')
};
