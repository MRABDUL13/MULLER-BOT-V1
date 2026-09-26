const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'testapi',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.testapi',
  execute: createExecutor('testapi', 'developer', 'Developer and diagnostics utility.')
};
