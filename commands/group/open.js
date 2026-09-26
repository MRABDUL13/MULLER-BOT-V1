const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'open',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.open',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('open', 'group', 'Group management utility.')
};
