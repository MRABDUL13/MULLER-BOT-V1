const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'truth',
  aliases: [],
  category: 'fun',
  description: 'Fun and entertainment command.',
  usage: '.truth',
  execute: createExecutor('truth', 'fun', 'Fun and entertainment command.')
};
