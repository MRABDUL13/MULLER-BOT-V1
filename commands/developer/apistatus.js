const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'apistatus',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.apistatus',
  execute: createExecutor('apistatus', 'developer', 'Developer and diagnostics utility.')
};
