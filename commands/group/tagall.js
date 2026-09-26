module.exports = {
  name: 'tagall',
  aliases: ['tag', 'mentionall'],
  category: 'group',
  description: 'Mention all group members',
  usage: '.tagall [message]',
  groupOnly: true,
  permission: 'GROUP_ADMIN',

  async execute(ctx) {
    try {
      if (!ctx.groupMetadata) {
        await ctx.reply('❌ Could not fetch group information');
        return;
      }

      const participants = ctx.groupMetadata.participants;
      const customMessage = ctx.args.join(' ') || '📢 Attention everyone!';

      let text = `${customMessage}\n\n`;
      const mentions = [];

      participants.forEach((p, i) => {
        text += `@${p.id.split('@')[0]} `;
        mentions.push(p.id);
      });

      await ctx.replyWithMention(text, mentions);
    } catch (error) {
      await ctx.reply('❌ Failed to tag all members');
    }
  }
};
