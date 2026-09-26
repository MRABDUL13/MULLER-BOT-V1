const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'recording',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.recording',
  execute: createExecutor('recording', 'whatsapp', 'WhatsApp utility command.')
};
