const { createExecutor } = require('../../lib/bulk-command');
module.exports = {
  name: 'setgc',
  aliases: [],
  category: 'statusgc',
  description: 'Set the custom GC status text for the current group.',
  usage: '.setgc <text>',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('setgc', 'statusgc', 'Set the custom GC status text for the current group.')
};
