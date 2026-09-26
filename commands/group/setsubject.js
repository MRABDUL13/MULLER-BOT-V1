const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setsubject',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.setsubject',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('setsubject', 'group', 'Group management utility.')
};
