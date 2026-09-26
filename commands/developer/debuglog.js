const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'debuglog',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.debuglog',
  execute: createExecutor('debuglog', 'developer', 'Developer and diagnostics utility.')
};
