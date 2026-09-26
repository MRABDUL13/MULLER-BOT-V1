const database = require('../../lib/database');
const { normalizePhoneNumber, isValidPhoneNumber } = require('../../lib/utils');

module.exports = {
  name: 'block',
  aliases: ['blockuser'],
  category: 'owner',
  description: 'Block a user from using the bot',
  usage: '.block 234XXXXXXXXXX or mention',
  permission: 'OWNER',

  async execute(ctx) {
    try {
      let userToBlock;

      // Check if mentioned
      const mentionedJid = ctx.message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      if (mentionedJid && mentionedJid.length > 0) {
        userToBlock = mentionedJid[0];
      } else if (ctx.args.length > 0) {
        const phoneNumber = ctx.args[0];
        if (!isValidPhoneNumber(phoneNumber)) {
          await ctx.reply('❌ Invalid phone number format');
          return;
        }
        userToBlock = `${normalizePhoneNumber(phoneNumber)}@s.whatsapp.net`;
      } else {
        await ctx.reply('❌ Please mention a user or provide a phone number');
        return;
      }

      await database.blockUser(userToBlock);
      await ctx.reply(`✅ @${userToBlock.split('@')[0]} has been blocked`);
    } catch (error) {
      await ctx.reply('❌ Failed to block user');
    }
  }
};
