const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'echo',
  aliases: [],
  category: 'audio',
  description: 'Audio processing utility.',
  usage: '.echo',
  execute: createExecutor('echo', 'audio', 'Audio processing utility.')
};
