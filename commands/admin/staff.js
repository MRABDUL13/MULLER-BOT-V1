const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'staff',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.staff',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('staff', 'admin', 'Group administrator utility.')
};
