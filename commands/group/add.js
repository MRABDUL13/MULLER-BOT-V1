const { normalizePhoneNumber, isValidPhoneNumber } = require('../../lib/utils');

module.exports = {
  name: 'add',
  aliases: ['invite'],
  category: 'group',
  description: 'Add a member to group',
  usage: '.add 234XXXXXXXXXX',
  groupOnly: true,
  permission: 'BOT_ADMIN',

  async execute(ctx) {
    try {
      if (ctx.args.length === 0) {
        await ctx.reply('❌ Please provide a phone number: .add 234XXXXXXXXXX');
        return;
      }

      const phoneNumber = ctx.args[0];
      
      if (!isValidPhoneNumber(phoneNumber)) {
        await ctx.reply('❌ Invalid phone number format');
        return;
      }

      const normalizedNumber = normalizePhoneNumber(phoneNumber);
      const jid = `${normalizedNumber}@s.whatsapp.net`;

      await ctx.socket.groupParticipantsUpdate(ctx.groupId, [jid], 'add');
      await ctx.reply(`✅ Added @${normalizedNumber} to the group`);
    } catch (error) {
      await ctx.reply('❌ Failed to add user. They may have privacy settings that prevent adding');
    }
  }
};
