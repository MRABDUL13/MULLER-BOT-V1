const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'getmsg',
  aliases: [],
  category: 'whatsapp',
  description: 'WhatsApp utility command.',
  usage: '.getmsg',
  execute: createExecutor('getmsg', 'whatsapp', 'WhatsApp utility command.')
};
