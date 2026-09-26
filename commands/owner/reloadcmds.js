const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'reloadcmds',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.reloadcmds',
  permission: 'OWNER',
  execute: createExecutor('reloadcmds', 'owner', 'Owner-only bot management utility.')
};
