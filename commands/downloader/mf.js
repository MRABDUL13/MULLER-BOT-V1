const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mf',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.mf',
  execute: createExecutor('mf', 'downloader', 'Media downloader utility.')
};
