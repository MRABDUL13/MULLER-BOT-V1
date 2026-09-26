const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'unwarn',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.unwarn',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('unwarn', 'admin', 'Group administrator utility.')
};
