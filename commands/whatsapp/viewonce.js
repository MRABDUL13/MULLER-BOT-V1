const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'viewonce',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.viewonce',
  execute: createExecutor('viewonce', 'whatsapp', 'WhatsApp utility command.')
};
