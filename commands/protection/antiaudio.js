const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antiaudio',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antiaudio',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antiaudio', 'protection', 'Group protection and automation utility.')
};
