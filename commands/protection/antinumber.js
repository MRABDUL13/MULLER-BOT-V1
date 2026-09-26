const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'antinumber',
  aliases: [],
  category: 'protection',
  description: 'Group protection and automation utility.',
  usage: '.antinumber',
  permission: 'GROUP_ADMIN',
  groupOnly: true,
  execute: createExecutor('antinumber', 'protection', 'Group protection and automation utility.')
};
