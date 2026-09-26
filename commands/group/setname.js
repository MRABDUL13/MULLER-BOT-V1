const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setname',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.setname',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('setname', 'group', 'Group management utility.')
};
