const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'play',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.play',
  execute: createExecutor('play', 'downloader', 'Media downloader utility.')
};
