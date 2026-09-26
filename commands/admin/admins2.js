const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'admins2',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.admins2',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('admins2', 'admin', 'Group administrator utility.')
};
