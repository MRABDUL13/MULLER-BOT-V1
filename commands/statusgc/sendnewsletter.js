const { createExecutor } = require('../../lib/bulk-command');
module.exports = {
  name: 'sendnewsletter',
  aliases: [],
  category: 'statusgc',
  description: 'Send text to the configured WhatsApp newsletter/channel.',
  usage: '.sendnewsletter <message>',
  permission: 'OWNER',
  execute: createExecutor('sendnewsletter', 'statusgc', 'Send text to the configured WhatsApp newsletter/channel.')
};
