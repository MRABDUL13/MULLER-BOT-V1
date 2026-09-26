const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'reply',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.reply',
  execute: createExecutor('reply', 'whatsapp', 'WhatsApp utility command.')
};
