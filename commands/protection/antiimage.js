const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antiimage',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antiimage',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antiimage', 'protection', 'Group protection and automation utility.')
};
