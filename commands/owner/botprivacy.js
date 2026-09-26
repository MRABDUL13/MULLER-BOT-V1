const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'botprivacy',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.botprivacy',
  permission: 'OWNER',
  execute: createExecutor('botprivacy', 'owner', 'Owner-only bot management utility.')
};
