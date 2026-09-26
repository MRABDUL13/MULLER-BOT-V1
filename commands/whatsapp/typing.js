const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'typing',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.typing',
  execute: createExecutor('typing', 'whatsapp', 'WhatsApp utility command.')
};
