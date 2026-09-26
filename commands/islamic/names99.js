const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'names99',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.names99',
  execute: createExecutor('names99', 'islamic', 'Islamic information/utility command.')
};
