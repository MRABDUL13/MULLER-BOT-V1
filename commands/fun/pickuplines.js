const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'pickuplines',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.pickuplines',
  execute: createExecutor('pickuplines', 'fun', 'Fun and entertainment command.')
};
