const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antidocument',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antidocument',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antidocument', 'protection', 'Group protection and automation utility.')
};
