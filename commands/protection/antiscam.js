const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antiscam',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antiscam',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antiscam', 'protection', 'Group protection and automation utility.')
};
