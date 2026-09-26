const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'benchmark',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.benchmark',
  execute: createExecutor('benchmark', 'developer', 'Developer and diagnostics utility.')
};
