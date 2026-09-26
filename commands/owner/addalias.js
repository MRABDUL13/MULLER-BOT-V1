const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'addalias',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.addalias',
  permission: 'OWNER',
  execute: createExecutor('addalias', 'owner', 'Owner-only bot management utility.')
};
