const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'unwarnall',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.unwarnall',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('unwarnall', 'admin', 'Group administrator utility.')
};
