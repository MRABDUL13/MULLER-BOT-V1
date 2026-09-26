const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'song',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.song',
  execute: createExecutor('song', 'downloader', 'Media downloader utility.')
};
