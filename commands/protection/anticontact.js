const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'anticontact',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.anticontact',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('anticontact', 'protection', 'Group protection and automation utility.')
};
