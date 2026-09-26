const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'adminlist',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.adminlist',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('adminlist', 'admin', 'Group administrator utility.')
};
