const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'quote',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.quote',
  execute: createExecutor('quote', 'fun', 'Fun and entertainment command.')
};
