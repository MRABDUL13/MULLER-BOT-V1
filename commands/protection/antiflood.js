const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antiflood',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antiflood',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antiflood', 'protection', 'Group protection and automation utility.')
};
