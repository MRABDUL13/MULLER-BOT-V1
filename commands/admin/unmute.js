const database = require('../../lib/database');

module.exports = {
  name: 'unmute',
  aliases: ['unsilence'],
  category: 'admin',
  description: 'Unmute a user in group',
  usage: '.unmute @user',
  groupOnly: true,
  permission: 'GROUP_ADMIN',

  async execute(ctx) {
    try {
      const mentionedJid = ctx.message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

      if (!mentionedJid || mentionedJid.length === 0) {
        await ctx.reply('❌ Please mention a user to unmute: .unmute @user');
        return;
      }

      const targetJid = mentionedJid[0];
      const settings = await database.getGroupSettings(ctx.groupId);
      
      if (!settings.muteList) {
        settings.muteList = [];
      }

      // Remove from mute list if there
      const index = settings.muteList.indexOf(targetJid);
      if (index > -1) {
        settings.muteList.splice(index, 1);
        await database.setGroupSettings(ctx.groupId, settings);
        await ctx.reply(`🔊 @${targetJid.split('@')[0]} has been unmuted`);
      } else {
        await ctx.reply(`❌ User is not muted`);
      }
    } catch (error) {
      await ctx.reply('❌ Failed to unmute user');
    }
  }
};
