const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'maintenance',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.maintenance',
  permission: 'OWNER',
  execute: createExecutor('maintenance', 'owner', 'Owner-only bot management utility.')
};
