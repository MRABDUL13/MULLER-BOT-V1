const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'disable',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.disable',
  permission: 'OWNER',
  execute: createExecutor('disable', 'owner', 'Owner-only bot management utility.')
};
