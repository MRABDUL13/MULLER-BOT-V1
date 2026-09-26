const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'tiktok',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.tiktok',
  execute: createExecutor('tiktok', 'downloader', 'Media downloader utility.')
};
