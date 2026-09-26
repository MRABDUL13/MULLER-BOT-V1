const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'adhkar',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.adhkar',
  execute: createExecutor('adhkar', 'islamic', 'Islamic information/utility command.')
};
