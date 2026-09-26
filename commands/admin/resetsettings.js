const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'resetsettings',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.resetsettings',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('resetsettings', 'admin', 'Group administrator utility.')
};
