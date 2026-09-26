const config = require('../../config/config');
const { getUptime, boxMessage } = require('../../lib/utils');

module.exports = {
  name: 'alive',
  aliases: ['status'],
  category: 'general',
  description: 'Check bot status and uptime',
  usage: '.alive',

  async execute(ctx) {
    const uptime = getUptime();
    const response = boxMessage(
      '🤖 MULLER BOT',
      `Name: ${config.BOT_NAME}`,
      `Status: ✅ Online`,
      `Uptime: ${uptime}`,
      `Mode: ${config.MODE.toUpperCase()}`,
      `Prefix: ${config.PREFIX}`
    );

    await ctx.reply(response);
  }
};
