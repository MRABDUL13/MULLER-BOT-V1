const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'prayertimes',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.prayertimes',
  execute: createExecutor('prayertimes', 'islamic', 'Islamic information/utility command.')
};
