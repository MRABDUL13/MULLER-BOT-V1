const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'ship',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.ship',
  execute: createExecutor('ship', 'fun', 'Fun and entertainment command.')
};
