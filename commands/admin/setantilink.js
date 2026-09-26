const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setantilink',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.setantilink',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('setantilink', 'admin', 'Group administrator utility.')
};
