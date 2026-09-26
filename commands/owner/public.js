const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'public',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.public',
  permission: 'OWNER',
  execute: createExecutor('public', 'owner', 'Owner-only bot management utility.')
};
