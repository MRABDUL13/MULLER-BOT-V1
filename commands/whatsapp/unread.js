const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'unread',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.unread',
  execute: createExecutor('unread', 'whatsapp', 'WhatsApp utility command.')
};
