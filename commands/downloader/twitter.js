const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'twitter',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.twitter',
  execute: createExecutor('twitter', 'downloader', 'Media downloader utility.')
};
