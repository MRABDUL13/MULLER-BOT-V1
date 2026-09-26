const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'dev',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.dev',
  execute: createExecutor('dev', 'developer', 'Developer and diagnostics utility.')
};
