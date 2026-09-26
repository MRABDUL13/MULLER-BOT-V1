const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antichange',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antichange',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antichange', 'protection', 'Group protection and automation utility.')
};
