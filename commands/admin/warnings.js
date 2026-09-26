const database = require('../../lib/database');

module.exports = {
  name: 'warnings',
  aliases: ['checkwarn'],
  category: 'admin',
  description: 'Check warnings for a user',
  usage: '.warnings @user',
  groupOnly: true,

  async execute(ctx) {
    try {
      const mentionedJid = ctx.message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

      if (!mentionedJid || mentionedJid.length === 0) {
        await ctx.reply('❌ Please mention a user: .warnings @user');
        return;
      }

      const targetJid = mentionedJid[0];
      const targetName = targetJid.split('@')[0];

      const warningCount = await database.getWarnings(ctx.groupId, targetJid);
      const settings = await database.getGroupSettings(ctx.groupId);
      const maxWarnings = settings.warnThreshold || 3;

      const response = `📋 WARNING RECORD\n\nUser: @${targetName}\nWarnings: ${warningCount}/${maxWarnings}`;

      await ctx.reply(response);
    } catch (error) {
      await ctx.reply('❌ Failed to get warnings');
    }
  }
};
