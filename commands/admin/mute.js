const database = require('../../lib/database');

module.exports = {
  name: 'mute',
  aliases: ['silence'],
  category: 'admin',
  description: 'Mute a user in group',
  usage: '.mute @user',
  groupOnly: true,
  permission: 'GROUP_ADMIN',

  async execute(ctx) {
    try {
      const mentionedJid = ctx.message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

      if (!mentionedJid || mentionedJid.length === 0) {
        await ctx.reply('❌ Please mention a user to mute: .mute @user');
        return;
      }

      const targetJid = mentionedJid[0];
      const settings = await database.getGroupSettings(ctx.groupId);
      
      if (!settings.muteList) {
        settings.muteList = [];
      }

      // Add to mute list if not already there
      if (!settings.muteList.includes(targetJid)) {
        settings.muteList.push(targetJid);
        await database.setGroupSettings(ctx.groupId, settings);
        await ctx.reply(`🔇 @${targetJid.split('@')[0]} has been muted`);
      } else {
        await ctx.reply(`❌ User is already muted`);
      }
    } catch (error) {
      await ctx.reply('❌ Failed to mute user');
    }
  }
};
