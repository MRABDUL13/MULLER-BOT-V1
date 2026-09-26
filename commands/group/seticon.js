const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'seticon',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.seticon',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('seticon', 'group', 'Group management utility.')
};
