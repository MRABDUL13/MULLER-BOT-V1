const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'truthordare',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.truthordare',
  execute: createExecutor('truthordare', 'fun', 'Fun and entertainment command.')
};
