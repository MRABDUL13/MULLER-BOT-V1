const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'reload',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.reload',
  permission: 'OWNER',
  execute: createExecutor('reload', 'owner', 'Owner-only bot management utility.')
};
