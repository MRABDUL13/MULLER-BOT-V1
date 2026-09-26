const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'quotes',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.quotes',
  execute: createExecutor('quotes', 'fun', 'Fun and entertainment command.')
};
