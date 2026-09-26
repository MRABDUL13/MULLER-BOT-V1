const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antiraid',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antiraid',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antiraid', 'protection', 'Group protection and automation utility.')
};
