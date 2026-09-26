const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'warnall',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.warnall',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('warnall', 'admin', 'Group administrator utility.')
};
