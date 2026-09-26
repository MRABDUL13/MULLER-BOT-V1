const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'cpu',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.cpu',
  execute: createExecutor('cpu', 'developer', 'Developer and diagnostics utility.')
};
