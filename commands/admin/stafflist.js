const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'stafflist',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.stafflist',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('stafflist', 'admin', 'Group administrator utility.')
};
