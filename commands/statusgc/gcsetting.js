const { createExecutor } = require('../../lib/bulk-command');
module.exports = {
  name: 'gcsetting',
  aliases: [],
  category: 'statusgc',
  description: 'View or change GC status settings for the current group.',
  usage: '.gcsetting [on|off]',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('gcsetting', 'statusgc', 'View or change GC status settings for the current group.')
};
