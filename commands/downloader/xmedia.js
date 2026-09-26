const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'xmedia',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.xmedia',
  execute: createExecutor('xmedia', 'downloader', 'Media downloader utility.')
};
