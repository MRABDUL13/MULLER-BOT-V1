const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'instagram',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.instagram',
  execute: createExecutor('instagram', 'downloader', 'Media downloader utility.')
};
