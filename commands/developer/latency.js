const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'latency',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.latency',
  execute: createExecutor('latency', 'developer', 'Developer and diagnostics utility.')
};
