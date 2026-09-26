const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'groupid2',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.groupid2',
  execute: createExecutor('groupid2', 'whatsapp', 'WhatsApp utility command.')
};
