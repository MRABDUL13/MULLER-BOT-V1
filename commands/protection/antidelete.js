const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antidelete',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antidelete',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antidelete', 'protection', 'Group protection and automation utility.')
};
