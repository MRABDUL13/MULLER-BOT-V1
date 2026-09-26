const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'apihelp',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.apihelp',
  execute: createExecutor('apihelp', 'developer', 'Developer and diagnostics utility.')
};
