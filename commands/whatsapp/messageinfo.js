const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'messageinfo',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.messageinfo',
  execute: createExecutor('messageinfo', 'whatsapp', 'WhatsApp utility command.')
};
