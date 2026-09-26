const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'debug',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.debug',
  execute: createExecutor('debug', 'developer', 'Developer and diagnostics utility.')
};
