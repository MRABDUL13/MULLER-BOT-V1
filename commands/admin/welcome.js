const database = require('../../lib/database');

module.exports = {
  name: 'welcome',
  aliases: ['setwelcome'],
  category: 'admin',
  description: 'Set welcome message for new members',
  usage: '.welcome on/off or .welcome set [message]',
  groupOnly: true,
  permission: 'GROUP_ADMIN',

  async execute(ctx) {
    try {
      const action = ctx.args[0]?.toLowerCase();

      if (!action || !['on', 'off', 'set'].includes(action)) {
        await ctx.reply('❌ Usage: .welcome on/off or .welcome set [message]');
        return;
      }

      if (action === 'set') {
        const message = ctx.args.slice(1).join(' ');
        if (!message) {
          await ctx.reply('❌ Please provide a welcome message');
          return;
        }

        await database.updateGroupSetting(ctx.groupId, 'welcomeMessage', message);
        await ctx.reply('✅ Welcome message set');
      } else {
        const isEnabled = action === 'on';
        await database.updateGroupSetting(ctx.groupId, 'welcome', isEnabled);
        const status = isEnabled ? '✅ enabled' : '❌ disabled';
        await ctx.reply(`Welcome messages have been ${status}`);
      }
    } catch (error) {
      await ctx.reply('❌ Failed to update welcome setting');
    }
  }
};
