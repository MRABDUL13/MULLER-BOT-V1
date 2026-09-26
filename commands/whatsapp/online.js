const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'online',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.online',
  execute: createExecutor('online', 'whatsapp', 'WhatsApp utility command.')
};
