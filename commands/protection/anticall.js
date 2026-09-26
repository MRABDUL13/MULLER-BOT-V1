const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'anticall',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.anticall',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('anticall', 'protection', 'Group protection and automation utility.')
};
