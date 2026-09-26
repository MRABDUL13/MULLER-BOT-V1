module.exports = {
  name: 'delete',
  aliases: ['del', 'delmsg'],
  category: 'admin',
  description: 'Delete a message (reply to message)',
  usage: '.delete',
  groupOnly: true,
  permission: 'BOT_ADMIN',

  async execute(ctx) {
    try {
      if (!ctx.isReply) {
        await ctx.reply('❌ Please reply to a message to delete it');
        return;
      }

      if (!ctx.quotedMessage) {
        await ctx.reply('❌ Could not find message to delete');
        return;
      }

      try {
        // Try to delete the quoted message
        await ctx.socket.sendMessage(ctx.jid, { delete: ctx.key.quoted });
        await ctx.reply('✅ Message deleted');
      } catch (error) {
        // If we can't delete (not our message), try to inform
        await ctx.reply('❌ Can only delete messages sent by the bot or when bot is admin');
      }
    } catch (error) {
      await ctx.reply('❌ Failed to delete message');
    }
  }
};
