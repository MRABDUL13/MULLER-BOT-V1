const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setowner',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.setowner',
  permission: 'OWNER',
  execute: createExecutor('setowner', 'owner', 'Owner-only bot management utility.')
};
