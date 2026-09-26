const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'approve',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.approve',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('approve', 'admin', 'Group administrator utility.')
};
