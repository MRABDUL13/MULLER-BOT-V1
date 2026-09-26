const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setantibot',
  aliases: [],
  category: 'admin',
  description: 'Group administrator utility.',
  usage: '.setantibot',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('setantibot', 'admin', 'Group administrator utility.')
};
