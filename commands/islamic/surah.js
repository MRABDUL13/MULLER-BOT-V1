const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'surah',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.surah',
  execute: createExecutor('surah', 'islamic', 'Islamic information/utility command.')
};
