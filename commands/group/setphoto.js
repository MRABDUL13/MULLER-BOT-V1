const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setphoto',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.setphoto',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('setphoto', 'group', 'Group management utility.')
};
