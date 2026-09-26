const database = require('../../lib/database');

module.exports = {
  name: 'warn',
  aliases: ['warning'],
  category: 'admin',
  description: 'Warn a user',
  usage: '.warn @user',
  groupOnly: true,
  permission: 'GROUP_ADMIN',

  async execute(ctx) {
    try {
      const mentionedJid = ctx.message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

      if (!mentionedJid || mentionedJid.length === 0) {
        await ctx.reply('❌ Please mention a user to warn: .warn @user');
        return;
      }

      const targetJid = mentionedJid[0];
      const targetName = targetJid.split('@')[0];

      const warningCount = await database.addWarning(ctx.groupId, targetJid);
      const settings = await database.getGroupSettings(ctx.groupId);
      const maxWarnings = settings.warnThreshold || 3;

      const response = `⚠️  Warning issued\n\nUser: @${targetName}\nWarnings: ${warningCount}/${maxWarnings}`;

      await ctx.reply(response);

      if (warningCount >= maxWarnings) {
        await ctx.reply(`❌ @${targetName} has exceeded maximum warnings and should be removed`);
      }
    } catch (error) {
      await ctx.reply('❌ Failed to warn user');
    }
  }
};
