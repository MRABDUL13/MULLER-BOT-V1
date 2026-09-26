const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'yt',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.yt',
  execute: createExecutor('yt', 'downloader', 'Media downloader utility.')
};
