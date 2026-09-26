const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'api',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.api',
  execute: createExecutor('api', 'developer', 'Developer and diagnostics utility.')
};
