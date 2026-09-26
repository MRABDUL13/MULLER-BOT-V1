const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'imagesearch',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.imagesearch',
  execute: createExecutor('imagesearch', 'search', 'Web/search utility.')
};
