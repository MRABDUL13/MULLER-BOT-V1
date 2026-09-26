const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'compatibility',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.compatibility',
  execute: createExecutor('compatibility', 'fun', 'Fun and entertainment command.')
};
