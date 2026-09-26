const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'webhook',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.webhook',
  execute: createExecutor('webhook', 'developer', 'Developer and diagnostics utility.')
};
