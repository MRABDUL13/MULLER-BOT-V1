const { permissions } = require('../../lib/permissions');

module.exports = {
  name: 'kick',
  aliases: ['remove'],
  category: 'group',
  description: 'Kick a member from group',
  usage: '.kick @user',
  groupOnly: true,
  permission: 'BOT_ADMIN',

  async execute(ctx) {
    try {
      const mentionedJid = ctx.message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

      if (!mentionedJid || mentionedJid.length === 0) {
        await ctx.reply('❌ Please mention a user to kick: .kick @user');
        return;
      }

      const targetJid = mentionedJid[0];
      
      // Don't allow kicking admins
      const targetParticipant = ctx.groupMetadata.participants.find(p => p.id === targetJid);
      if (targetParticipant?.admin) {
        await ctx.reply('❌ Cannot kick admins');
        return;
      }

      await ctx.socket.groupParticipantsUpdate(ctx.groupId, [targetJid], 'remove');
      await ctx.reply(`✅ @${targetJid.split('@')[0]} has been kicked from the group`);
    } catch (error) {
      await ctx.reply('❌ Failed to kick user');
    }
  }
};
