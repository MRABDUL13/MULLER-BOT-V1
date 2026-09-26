const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'unpin',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.unpin',
  execute: createExecutor('unpin', 'whatsapp', 'WhatsApp utility command.')
};
