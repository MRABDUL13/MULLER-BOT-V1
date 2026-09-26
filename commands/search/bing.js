const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'bing',
  aliases: [],
  category: 'search',
  description: 'Web/search utility.',
  usage: '.bing',
  execute: createExecutor('bing', 'search', 'Web/search utility.')
};
