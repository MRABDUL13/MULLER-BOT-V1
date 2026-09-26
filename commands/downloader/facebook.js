const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'facebook',
  aliases: [],
  category: 'downloader',
  description: 'Media downloader utility.',
  usage: '.facebook',
  execute: createExecutor('facebook', 'downloader', 'Media downloader utility.')
};
