module.exports = {
  name: 'admins',
  aliases: ['adminlist'],
  category: 'group',
  description: 'List all group admins',
  usage: '.admins',
  groupOnly: true,

  async execute(ctx) {
    try {
      if (!ctx.groupMetadata) {
        await ctx.reply('❌ Could not fetch group information');
        return;
      }

      const admins = ctx.groupMetadata.participants.filter(p => p.admin);
      
      if (admins.length === 0) {
        await ctx.reply('❌ No admins found in this group');
        return;
      }

      let text = '👨‍💼 GROUP ADMINS\n\n';
      admins.forEach((admin, i) => {
        text += `${i + 1}. @${admin.id.split('@')[0]}\n`;
      });

      const mentions = admins.map(a => a.id);
      await ctx.replyWithMention(text, mentions);
    } catch (error) {
      await ctx.reply('❌ Failed to get admins list');
    }
  }
};
