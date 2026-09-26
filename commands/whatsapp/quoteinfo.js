const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'quoteinfo',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.quoteinfo',
  execute: createExecutor('quoteinfo', 'whatsapp', 'WhatsApp utility command.')
};
