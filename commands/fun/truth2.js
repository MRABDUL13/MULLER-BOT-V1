const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'truth2',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.truth2',
  execute: createExecutor('truth2', 'fun', 'Fun and entertainment command.')
};
