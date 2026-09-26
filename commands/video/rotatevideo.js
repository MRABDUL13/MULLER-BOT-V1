const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'rotatevideo',
  aliases: [],
  category: 'video',
  description: 'Video processing utility.',
  usage: '.rotatevideo',
  execute: createExecutor('rotatevideo', 'video', 'Video processing utility.')
};
