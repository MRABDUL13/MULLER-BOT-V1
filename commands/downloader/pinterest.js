const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'pinterest',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.pinterest',
  execute: createExecutor('pinterest', 'downloader', 'Media downloader utility.')
};
