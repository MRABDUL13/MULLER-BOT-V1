const { createExecutor } = require('../../lib/bulk-command');
module.exports = {
  name: 'newsletter',
  aliases: [],
  category: 'statusgc',
  description: 'Show the configured WhatsApp newsletter/channel.',
  usage: '.newsletter',
  permission: 'OWNER',
  execute: createExecutor('newsletter', 'statusgc', 'Show the configured WhatsApp newsletter/channel.')
};
