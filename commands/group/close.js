const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'close',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.close',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('close', 'group', 'Group management utility.')
};
