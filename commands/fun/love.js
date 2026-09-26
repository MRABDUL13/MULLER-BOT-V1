const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'love',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.love',
  execute: createExecutor('love', 'fun', 'Fun and entertainment command.')
};
