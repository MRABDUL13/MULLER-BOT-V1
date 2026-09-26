const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'unload',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.unload',
  permission: 'OWNER',
  execute: createExecutor('unload', 'owner', 'Owner-only bot management utility.')
};
