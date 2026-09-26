const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'membercount',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.membercount',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('membercount', 'group', 'Group management utility.')
};
