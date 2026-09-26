const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'adminonly',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.adminonly',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('adminonly', 'admin', 'Group administrator utility.')
};
