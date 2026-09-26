const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'insult',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.insult',
  execute: createExecutor('insult', 'fun', 'Fun and entertainment command.')
};
