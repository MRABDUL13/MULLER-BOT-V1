const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'developer',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.developer',
  execute: createExecutor('developer', 'developer', 'Developer and diagnostics utility.')
};
