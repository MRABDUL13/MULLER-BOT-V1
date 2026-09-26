const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'resetgroup',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.resetgroup',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('resetgroup', 'admin', 'Group administrator utility.')
};
