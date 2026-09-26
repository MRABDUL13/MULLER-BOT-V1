const { getUptime, boxMessage } = require('../../lib/utils');

module.exports = {
  name: 'runtime',
  aliases: ['uptime'],
  category: 'general',
  description: 'Display bot uptime',
  usage: '.runtime',

  async execute(ctx) {
    const uptime = getUptime();
    const response = boxMessage(
      '⏱️  BOT UPTIME',
      `Runtime: ${uptime}`
    );

    await ctx.reply(response);
  }
};
