const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'nightcore',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.nightcore',
  execute: createExecutor('nightcore', 'audio', 'Audio processing utility.')
};
