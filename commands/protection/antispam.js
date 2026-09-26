const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antispam',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antispam',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antispam', 'protection', 'Group protection and automation utility.')
};
