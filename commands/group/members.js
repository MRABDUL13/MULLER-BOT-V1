const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'members',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.members',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('members', 'group', 'Group management utility.')
};
