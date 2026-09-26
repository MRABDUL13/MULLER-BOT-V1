const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'sourcecode',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.sourcecode',
  execute: createExecutor('sourcecode', 'developer', 'Developer and diagnostics utility.')
};
