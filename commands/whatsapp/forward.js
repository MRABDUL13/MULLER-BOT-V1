const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'forward',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.forward',
  execute: createExecutor('forward', 'whatsapp', 'WhatsApp utility command.')
};
