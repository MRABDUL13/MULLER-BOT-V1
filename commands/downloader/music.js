const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'music',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.music',
  execute: createExecutor('music', 'downloader', 'Media downloader utility.')
};
