const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'demoteall',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.demoteall',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('demoteall', 'admin', 'Group administrator utility.')
};
