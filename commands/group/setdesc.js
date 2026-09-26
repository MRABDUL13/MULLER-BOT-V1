const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setdesc',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.setdesc',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('setdesc', 'group', 'Group management utility.')
};
