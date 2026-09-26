const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'resetsecurity',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.resetsecurity',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('resetsecurity', 'admin', 'Group administrator utility.')
};
