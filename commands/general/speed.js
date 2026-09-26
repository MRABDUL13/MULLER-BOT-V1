const { boxMessage } = require('../../lib/utils');

module.exports = {
  name: 'speed',
  aliases: ['ping2'],
  category: 'general',
  description: 'Measure bot speed/latency',
  usage: '.speed',

  async execute(ctx) {
    const start = Date.now();
    const latency = Date.now() - start;

    const speedStatus = latency < 50 ? '🟢 Excellent' : 
                       latency < 100 ? '🟡 Good' : 
                       '🔴 Slow';

    const response = boxMessage(
      '⚡ SPEED TEST',
      `Latency: ${latency}ms`,
      `Status: ${speedStatus}`
    );

    await ctx.reply(response);
  }
};
