const { createExecutor } = require('../../lib/bulk-command');

module.exports = {
  name: 'zakatcalc',
  aliases: [],
  category: 'islamic',
  description: 'Islamic information/utility command.',
  usage: '.zakatcalc',
  execute: createExecutor('zakatcalc', 'islamic', 'Islamic information/utility command.')
};
