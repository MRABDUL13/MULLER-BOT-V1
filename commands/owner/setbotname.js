const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'setbotname',
  aliases: [],
  category: 'owner',
  description: 'Owner-only bot management utility.',
  usage: '.setbotname',
  permission: 'OWNER',
  execute: createExecutor('setbotname', 'owner', 'Owner-only bot management utility.')
};
