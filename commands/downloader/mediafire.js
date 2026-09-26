const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'mediafire',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.mediafire',
  execute: createExecutor('mediafire', 'downloader', 'Media downloader utility.')
};
