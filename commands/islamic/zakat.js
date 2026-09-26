const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'zakat',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.zakat',
  execute: createExecutor('zakat', 'islamic', 'Islamic information/utility command.')
};
