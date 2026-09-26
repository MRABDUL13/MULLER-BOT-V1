const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'roast',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.roast',
  execute: createExecutor('roast', 'fun', 'Fun and entertainment command.')
};
