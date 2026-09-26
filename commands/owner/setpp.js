const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setpp',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.setpp',
  permission: 'OWNER',
  execute: createExecutor('setpp', 'owner', 'Owner-only bot management utility.')
};
