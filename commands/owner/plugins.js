const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'plugins',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.plugins',
  permission: 'OWNER',
  execute: createExecutor('plugins', 'owner', 'Owner-only bot management utility.')
};
