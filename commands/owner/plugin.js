const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'plugin',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.plugin',
  permission: 'OWNER',
  execute: createExecutor('plugin', 'owner', 'Owner-only bot management utility.')
};
