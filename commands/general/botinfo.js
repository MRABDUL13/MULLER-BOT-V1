const config = require('../../config/config');
const { boxMessage } = require('../../lib/utils');

module.exports = {
  name: 'botinfo',
  aliases: ['info'],
  category: 'general',
  description: 'Display bot information',
  usage: '.botinfo',

  async execute(ctx) {
    const response = boxMessage(
      '🤖 BOT INFORMATION',
      `Name: ${config.BOT_NAME}`,
      `Mode: ${config.MODE}`,
      `Prefix: ${config.PREFIX}`,
      `Framework: Baileys v7`,
      `Runtime: Node.js`,
      `Built by: MULLER TECH`
    );

    await ctx.reply(response);
  }
};
