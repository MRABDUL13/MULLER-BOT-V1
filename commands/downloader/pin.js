const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'pin',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.pin',
  execute: createExecutor('pin', 'downloader', 'Media downloader utility.')
};
