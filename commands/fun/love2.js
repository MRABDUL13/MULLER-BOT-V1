const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'love2',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.love2',
  execute: createExecutor('love2', 'fun', 'Fun and entertainment command.')
};
