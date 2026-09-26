const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'pickup',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.pickup',
  execute: createExecutor('pickup', 'fun', 'Fun and entertainment command.')
};
