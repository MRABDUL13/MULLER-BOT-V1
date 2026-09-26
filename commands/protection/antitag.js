const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antitag',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antitag',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antitag', 'protection', 'Group protection and automation utility.')
};
