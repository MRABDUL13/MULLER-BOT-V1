const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'ytmp4',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.ytmp4',
  execute: createExecutor('ytmp4', 'downloader', 'Media downloader utility.')
};
