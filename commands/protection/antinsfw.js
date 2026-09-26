const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antinsfw',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antinsfw',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antinsfw', 'protection', 'Group protection and automation utility.')
};
