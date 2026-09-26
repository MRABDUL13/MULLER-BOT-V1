const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'reject',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.reject',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('reject', 'admin', 'Group administrator utility.')
};
