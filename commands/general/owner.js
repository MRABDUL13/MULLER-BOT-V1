const config = require('../../config/config');
const { boxMessage } = require('../../lib/utils');

module.exports = {
  name: 'owner',
  aliases: ['creator'],
  category: 'general',
  description: 'Display bot owner contact',
  usage: '.owner',

  async execute(ctx) {
    const ownerNumber = config.OWNER_NUMBER;
    const response = boxMessage(
      '👤 BOT OWNER',
      `Number: ${ownerNumber}`,
      '',
      `Contact via WhatsApp: wa.me/${ownerNumber}`
    );

    await ctx.reply(response);
  }
};
