const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setmute',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.setmute',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('setmute', 'admin', 'Group administrator utility.')
};
