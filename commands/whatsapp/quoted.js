const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'quoted',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.quoted',
  execute: createExecutor('quoted', 'whatsapp', 'WhatsApp utility command.')
};
