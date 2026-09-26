const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'dare',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.dare',
  execute: createExecutor('dare', 'fun', 'Fun and entertainment command.')
};
