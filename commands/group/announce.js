const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'announce',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.announce',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('announce', 'group', 'Group management utility.')
};
