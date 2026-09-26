const { createExecutor } = require('../../lib/bulk-command');
module.exports = {
  name: 'postnews',
  aliases: [],
  category: 'statusgc',
  description: 'Post text to the configured WhatsApp newsletter/channel.',
  usage: '.postnews <message>',
  permission: 'OWNER',
  execute: createExecutor('postnews', 'statusgc', 'Post text to the configured WhatsApp newsletter/channel.')
};
