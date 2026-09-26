const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'load',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.load',
  permission: 'OWNER',
  execute: createExecutor('load', 'owner', 'Owner-only bot management utility.')
};
