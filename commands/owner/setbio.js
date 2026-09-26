const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setbio',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.setbio',
  permission: 'OWNER',
  execute: createExecutor('setbio', 'owner', 'Owner-only bot management utility.')
};
