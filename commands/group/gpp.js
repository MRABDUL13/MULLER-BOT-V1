const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'gpp',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.gpp',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('gpp', 'group', 'Group management utility.')
};
