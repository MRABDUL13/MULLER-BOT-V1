const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'ownerinfo',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.ownerinfo',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('ownerinfo', 'group', 'Group management utility.')
};
