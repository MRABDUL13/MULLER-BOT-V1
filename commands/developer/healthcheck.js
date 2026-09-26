const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'healthcheck',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.healthcheck',
  execute: createExecutor('healthcheck', 'developer', 'Developer and diagnostics utility.')
};
