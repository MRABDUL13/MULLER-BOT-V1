const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'ig',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.ig',
  execute: createExecutor('ig', 'downloader', 'Media downloader utility.')
};
