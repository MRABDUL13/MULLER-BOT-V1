module.exports = {
  name: 'demote',
  aliases: ['removeadmin'],
  category: 'group',
  description: 'Demote an admin to member',
  usage: '.demote @user',
  groupOnly: true,
  permission: 'BOT_ADMIN',

  async execute(ctx) {
    try {
      const mentionedJid = ctx.message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

      if (!mentionedJid || mentionedJid.length === 0) {
        await ctx.reply('❌ Please mention a user to demote: .demote @user');
        return;
      }

      const targetJid = mentionedJid[0];
      
      // Check if is admin
      const targetParticipant = ctx.groupMetadata.participants.find(p => p.id === targetJid);
      if (!targetParticipant?.admin) {
        await ctx.reply('❌ User is not an admin');
        return;
      }

      await ctx.socket.groupDemoteAdmin(ctx.groupId, [targetJid]);
      await ctx.reply(`✅ @${targetJid.split('@')[0]} is no longer an admin`);
    } catch (error) {
      await ctx.reply('❌ Failed to demote user');
    }
  }
};
