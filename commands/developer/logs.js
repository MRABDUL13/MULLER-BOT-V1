const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'logs',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.logs',
  execute: createExecutor('logs', 'developer', 'Developer and diagnostics utility.')
};
