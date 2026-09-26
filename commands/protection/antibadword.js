const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antibadword',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antibadword',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antibadword', 'protection', 'Group protection and automation utility.')
};
