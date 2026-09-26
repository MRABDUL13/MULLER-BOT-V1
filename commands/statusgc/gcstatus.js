const { createExecutor } = require('../../lib/bulk-command');
module.exports = {
  name: 'gcstatus',
  aliases: [],
  category: 'statusgc',
  description: 'Show the current group status and GC settings.',
  usage: '.gcstatus',
  groupOnly: true,
  execute: createExecutor('gcstatus', 'statusgc', 'Show the current group status and GC settings.')
};
