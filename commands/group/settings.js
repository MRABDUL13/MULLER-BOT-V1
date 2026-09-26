const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'settings',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.settings',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('settings', 'group', 'Group management utility.')
};
