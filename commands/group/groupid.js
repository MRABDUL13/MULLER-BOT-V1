const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'groupid',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.groupid',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('groupid', 'group', 'Group management utility.')
};
