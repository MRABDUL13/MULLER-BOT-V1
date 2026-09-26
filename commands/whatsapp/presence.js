const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'presence',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.presence',
  execute: createExecutor('presence', 'whatsapp', 'WhatsApp utility command.')
};
