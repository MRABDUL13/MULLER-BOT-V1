const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'sender',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.sender',
  execute: createExecutor('sender', 'whatsapp', 'WhatsApp utility command.')
};
