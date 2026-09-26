const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'ramadan',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.ramadan',
  execute: createExecutor('ramadan', 'islamic', 'Islamic information/utility command.')
};
