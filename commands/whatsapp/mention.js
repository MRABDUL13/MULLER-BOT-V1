const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mention',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.mention',
  execute: createExecutor('mention', 'whatsapp', 'WhatsApp utility command.')
};
