const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'tt',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.tt',
  execute: createExecutor('tt', 'downloader', 'Media downloader utility.')
};
