const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setstatus',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.setstatus',
  permission: 'OWNER',
  execute: createExecutor('setstatus', 'owner', 'Owner-only bot management utility.')
};
