const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'promoteall',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.promoteall',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('promoteall', 'admin', 'Group administrator utility.')
};
