const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'revoke',
  aliases: [],
  category: 'group',
  description: 'Group management utility.',
  usage: '.revoke',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('revoke', 'group', 'Group management utility.')
};
