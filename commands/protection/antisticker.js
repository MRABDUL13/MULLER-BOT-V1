const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antisticker',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antisticker',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antisticker', 'protection', 'Group protection and automation utility.')
};
