const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'hadith',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.hadith',
  execute: createExecutor('hadith', 'islamic', 'Islamic information/utility command.')
};
