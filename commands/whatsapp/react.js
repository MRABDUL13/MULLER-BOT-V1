const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'react',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.react',
  execute: createExecutor('react', 'whatsapp', 'WhatsApp utility command.')
};
