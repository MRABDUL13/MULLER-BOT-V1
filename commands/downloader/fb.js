const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'fb',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.fb',
  execute: createExecutor('fb', 'downloader', 'Media downloader utility.')
};
