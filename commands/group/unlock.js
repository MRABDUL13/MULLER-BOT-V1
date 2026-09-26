const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'unlock',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.unlock',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('unlock', 'group', 'Group management utility.')
};
