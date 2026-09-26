const { boxMessage } = require('../../lib/utils');

module.exports = {
  name: 'ping',
  aliases: ['p'],
  category: 'general',
  description: 'Check bot response speed',
  usage: '.ping',

  async execute(ctx) {
    const start = Date.now();
    const msg = await ctx.socket.sendMessage(ctx.jid, { text: '⏱️ Measuring...' });
    const latency = Date.now() - start;

    const response = boxMessage(
      '⚡ PONG!',
      `Speed: ${latency}ms`,
      `Latency: ${latency > 100 ? '🔴' : '🟢'}`
    );

    await ctx.reply(response);
  }
};
