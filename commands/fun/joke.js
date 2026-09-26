const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'joke',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.joke',
  execute: createExecutor('joke', 'fun', 'Fun and entertainment command.')
};
