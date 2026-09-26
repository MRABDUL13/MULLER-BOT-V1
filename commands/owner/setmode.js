const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setmode',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.setmode',
  permission: 'OWNER',
  execute: createExecutor('setmode', 'owner', 'Owner-only bot management utility.')
};
