const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setprefix',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.setprefix',
  permission: 'OWNER',
  execute: createExecutor('setprefix', 'owner', 'Owner-only bot management utility.')
};
