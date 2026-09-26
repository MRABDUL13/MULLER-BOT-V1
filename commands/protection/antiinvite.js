const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antiinvite',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antiinvite',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antiinvite', 'protection', 'Group protection and automation utility.')
};
