const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setunmute',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.setunmute',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('setunmute', 'admin', 'Group administrator utility.')
};
