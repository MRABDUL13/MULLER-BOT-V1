const { recoverViewOnce } = require('../../lib/viewonce');

module.exports = {
  name: 'vv',
  aliases: ['viewonce', 'view-once', 'vo'],
  category: 'media',
  description: 'Recover quoted view-once media and resend it in this chat',
  usage: '.vv (reply to a view-once image, video, or audio)',

  async execute(ctx) {
    const quoted = ctx.quotedMessage;
    if (!quoted) {
      await ctx.reply('Please reply to a view-once image, video, or audio.');
      return;
    }

    const result = await recoverViewOnce(ctx.socket, quoted, {
      targetJid: ctx.jid,
      quoted: ctx.message,
    });

    if (!result.ok) {
      await ctx.reply(result.error);
    }
  },
};
