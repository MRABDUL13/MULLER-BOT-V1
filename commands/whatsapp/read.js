const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'read',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.read',
  execute: createExecutor('read', 'whatsapp', 'WhatsApp utility command.')
};
