const { boxMessage } = require('../../lib/utils');

module.exports = {
  name: 'groupinfo',
  aliases: ['ginfo', 'gdetails'],
  category: 'group',
  description: 'Display group information',
  usage: '.groupinfo',
  groupOnly: true,

  async execute(ctx) {
    try {
      if (!ctx.groupMetadata) {
        await ctx.reply('❌ Could not fetch group information');
        return;
      }

      const meta = ctx.groupMetadata;
      const memberCount = meta.participants.length;
      const adminCount = meta.participants.filter(p => p.admin).length;

      const response = boxMessage(
        '📊 GROUP INFORMATION',
        `Name: ${meta.subject}`,
        `Members: ${memberCount}`,
        `Admins: ${adminCount}`,
        `Created: ${new Date(meta.creation * 1000).toLocaleDateString()}`,
        `Description: ${meta.desc || 'None'}`
      );

      await ctx.reply(response);
    } catch (error) {
      await ctx.reply('❌ Failed to get group information');
    }
  }
};
