const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'youtubevideo',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.youtubevideo',
  execute: createExecutor('youtubevideo', 'downloader', 'Media downloader utility.')
};
