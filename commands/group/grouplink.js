const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'grouplink',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.grouplink',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('grouplink', 'group', 'Group management utility.')
};
