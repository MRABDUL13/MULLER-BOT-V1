const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'useronly',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.useronly',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('useronly', 'admin', 'Group administrator utility.')
};
