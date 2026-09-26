const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'prayer',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.prayer',
  execute: createExecutor('prayer', 'islamic', 'Islamic information/utility command.')
};
