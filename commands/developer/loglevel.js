const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'loglevel',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.loglevel',
  execute: createExecutor('loglevel', 'developer', 'Developer and diagnostics utility.')
};
