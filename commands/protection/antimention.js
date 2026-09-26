const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antimention',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antimention',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antimention', 'protection', 'Group protection and automation utility.')
};
