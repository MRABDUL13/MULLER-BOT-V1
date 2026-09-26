const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'participants',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.participants',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('participants', 'group', 'Group management utility.')
};
