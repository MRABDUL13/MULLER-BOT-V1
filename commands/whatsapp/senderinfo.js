const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'senderinfo',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.senderinfo',
  execute: createExecutor('senderinfo', 'whatsapp', 'WhatsApp utility command.')
};
