const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'invite',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.invite',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('invite', 'group', 'Group management utility.')
};
