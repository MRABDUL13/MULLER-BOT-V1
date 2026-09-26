const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'pingapi',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.pingapi',
  execute: createExecutor('pingapi', 'developer', 'Developer and diagnostics utility.')
};
