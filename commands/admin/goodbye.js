const database = require('../../lib/database');

module.exports = {
  name: 'goodbye',
  aliases: ['setgoodbye'],
  category: 'admin',
  description: 'Set goodbye message for leaving members',
  usage: '.goodbye on/off or .goodbye set [message]',
  groupOnly: true,
  permission: 'GROUP_ADMIN',

  async execute(ctx) {
    try {
      const action = ctx.args[0]?.toLowerCase();

      if (!action || !['on', 'off', 'set'].includes(action)) {
        await ctx.reply('❌ Usage: .goodbye on/off or .goodbye set [message]');
        return;
      }

      if (action === 'set') {
        const message = ctx.args.slice(1).join(' ');
        if (!message) {
          await ctx.reply('❌ Please provide a goodbye message');
          return;
        }

        await database.updateGroupSetting(ctx.groupId, 'goodbyeMessage', message);
        await ctx.reply('✅ Goodbye message set');
      } else {
        const isEnabled = action === 'on';
        await database.updateGroupSetting(ctx.groupId, 'goodbye', isEnabled);
        const status = isEnabled ? '✅ enabled' : '❌ disabled';
        await ctx.reply(`Goodbye messages have been ${status}`);
      }
    } catch (error) {
      await ctx.reply('❌ Failed to update goodbye setting');
    }
  }
};
