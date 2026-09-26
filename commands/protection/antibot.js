const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antibot',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antibot',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antibot', 'protection', 'Group protection and automation utility.')
};
