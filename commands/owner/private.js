const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'private',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.private',
  permission: 'OWNER',
  execute: createExecutor('private', 'owner', 'Owner-only bot management utility.')
};
