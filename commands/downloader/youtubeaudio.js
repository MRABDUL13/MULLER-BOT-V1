const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'youtubeaudio',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.youtubeaudio',
  execute: createExecutor('youtubeaudio', 'downloader', 'Media downloader utility.')
};
