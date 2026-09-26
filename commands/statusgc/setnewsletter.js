const { createExecutor } = require('../../lib/bulk-command');
module.exports = {
  name: 'setnewsletter',
  aliases: [],
  category: 'statusgc',
  description: 'Set the WhatsApp newsletter/channel JID used for posts.',
  usage: '.setnewsletter <newsletter JID>',
  permission: 'OWNER',
  execute: createExecutor('setnewsletter', 'statusgc', 'Set the WhatsApp newsletter/channel JID used for posts.')
};
