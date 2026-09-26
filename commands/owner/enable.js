const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'enable',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.enable',
  permission: 'OWNER',
  execute: createExecutor('enable', 'owner', 'Owner-only bot management utility.')
};
