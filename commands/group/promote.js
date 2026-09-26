module.exports = {
  name: 'promote',
  aliases: ['makeadmin'],
  category: 'group',
  description: 'Promote a member to admin',
  usage: '.promote @user',
  groupOnly: true,
  permission: 'BOT_ADMIN',

  async execute(ctx) {
    try {
      const mentionedJid = ctx.message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

      if (!mentionedJid || mentionedJid.length === 0) {
        await ctx.reply('❌ Please mention a user to promote: .promote @user');
        return;
      }

      const targetJid = mentionedJid[0];
      
      // Check if already admin
      const targetParticipant = ctx.groupMetadata.participants.find(p => p.id === targetJid);
      if (targetParticipant?.admin) {
        await ctx.reply('❌ User is already an admin');
        return;
      }

      await ctx.socket.groupMakeAdmin(ctx.groupId, [targetJid]);
      await ctx.reply(`✅ @${targetJid.split('@')[0]} is now an admin`);
    } catch (error) {
      await ctx.reply('❌ Failed to promote user');
    }
  }
};
