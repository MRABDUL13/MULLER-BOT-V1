const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'ram',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.ram',
  execute: createExecutor('ram', 'developer', 'Developer and diagnostics utility.')
};
