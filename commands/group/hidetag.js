module.exports = {
  name: 'hidetag',
  aliases: ['htag'],
  category: 'group',
  description: 'Mention all members without showing numbers',
  usage: '.hidetag [message]',
  groupOnly: true,
  permission: 'GROUP_ADMIN',

  async execute(ctx) {
    try {
      if (!ctx.groupMetadata) {
        await ctx.reply('❌ Could not fetch group information');
        return;
      }

      const participants = ctx.groupMetadata.participants;
      const customMessage = ctx.args.join(' ') || '📢 Attention!';

      const mentions = participants.map(p => p.id);

      // Send with mentions but without displaying all numbers
      await ctx.replyWithMention(customMessage, mentions);
    } catch (error) {
      await ctx.reply('❌ Failed to send hidetag');
    }
  }
};
