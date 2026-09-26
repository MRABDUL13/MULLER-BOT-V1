const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'joke2',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.joke2',
  execute: createExecutor('joke2', 'fun', 'Fun and entertainment command.')
};
