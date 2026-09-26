const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antivideo',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antivideo',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antivideo', 'protection', 'Group protection and automation utility.')
};
