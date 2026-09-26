const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'gif',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.gif',
  execute: createExecutor('gif', 'video', 'Video processing utility.')
};
