const database = require('../../lib/database');
const { normalizePhoneNumber, isValidPhoneNumber } = require('../../lib/utils');

module.exports = {
  name: 'unblock',
  aliases: ['unblockuser'],
  category: 'owner',
  description: 'Unblock a user',
  usage: '.unblock 234XXXXXXXXXX or mention',
  permission: 'OWNER',

  async execute(ctx) {
    try {
      let userToUnblock;

      // Check if mentioned
      const mentionedJid = ctx.message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      if (mentionedJid && mentionedJid.length > 0) {
        userToUnblock = mentionedJid[0];
      } else if (ctx.args.length > 0) {
        const phoneNumber = ctx.args[0];
        if (!isValidPhoneNumber(phoneNumber)) {
          await ctx.reply('❌ Invalid phone number format');
          return;
        }
        userToUnblock = `${normalizePhoneNumber(phoneNumber)}@s.whatsapp.net`;
      } else {
        await ctx.reply('❌ Please mention a user or provide a phone number');
        return;
      }

      await database.unblockUser(userToUnblock);
      await ctx.reply(`✅ @${userToUnblock.split('@')[0]} has been unblocked`);
    } catch (error) {
      await ctx.reply('❌ Failed to unblock user');
    }
  }
};
