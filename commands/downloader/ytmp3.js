const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'ytmp3',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.ytmp3',
  execute: createExecutor('ytmp3', 'downloader', 'Media downloader utility.')
};
