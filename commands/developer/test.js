const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'test',
  aliases: [],
  category: 'developer',
  description: 'Developer and diagnostics utility.',
  usage: '.test',
  execute: createExecutor('test', 'developer', 'Developer and diagnostics utility.')
};
