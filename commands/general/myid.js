const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'myid',
  aliases: [],
  category: 'general',
  description: 'General bot information and utility command.',
  usage: '.myid',
  execute: createExecutor('myid', 'general', 'General bot information and utility command.')
};
