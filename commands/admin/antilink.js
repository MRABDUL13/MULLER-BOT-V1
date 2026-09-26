const database = require('../../lib/database');

module.exports = {
  name: 'antilink',
  aliases: ['linkban'],
  category: 'admin',
  description: 'Enable/disable anti-link protection',
  usage: '.antilink on/off',
  groupOnly: true,
  permission: 'GROUP_ADMIN',

  async execute(ctx) {
    try {
      const action = ctx.args[0]?.toLowerCase();

      if (!action || !['on', 'off'].includes(action)) {
        await ctx.reply('❌ Usage: .antilink on or .antilink off');
        return;
      }

      const isEnabled = action === 'on';
      await database.updateGroupSetting(ctx.groupId, 'antilink', isEnabled);

      const status = isEnabled ? '✅ enabled' : '❌ disabled';
      await ctx.reply(`Antilink has been ${status}`);
    } catch (error) {
      await ctx.reply('❌ Failed to update antilink setting');
    }
  }
};
