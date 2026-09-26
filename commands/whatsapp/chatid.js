const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'chatid',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.chatid',
  execute: createExecutor('chatid', 'whatsapp', 'WhatsApp utility command.')
};
