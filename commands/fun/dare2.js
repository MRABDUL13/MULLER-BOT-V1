const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'dare2',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.dare2',
  execute: createExecutor('dare2', 'fun', 'Fun and entertainment command.')
};
