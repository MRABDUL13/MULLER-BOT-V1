const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'quran',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.quran',
  execute: createExecutor('quran', 'islamic', 'Islamic information/utility command.')
};
