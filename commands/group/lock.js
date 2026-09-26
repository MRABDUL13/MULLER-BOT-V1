const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'lock',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.lock',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('lock', 'group', 'Group management utility.')
};
