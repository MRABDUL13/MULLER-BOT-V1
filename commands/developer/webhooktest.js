const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'webhooktest',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.webhooktest',
  execute: createExecutor('webhooktest', 'developer', 'Developer and diagnostics utility.')
};
