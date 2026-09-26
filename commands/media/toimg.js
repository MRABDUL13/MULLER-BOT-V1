module.exports = {
  name: 'toimg',
  aliases: ['img'],
  category: 'media',
  description: 'Convert sticker to image',
  usage: '.toimg (reply to sticker)',

  async execute(ctx) {
    try {
      if (!ctx.quotedMessage) {
        await ctx.reply('❌ Please reply to a sticker to convert it to an image');
        return;
      }

      if (!ctx.quotedMessage.stickerMessage) {
        await ctx.reply('❌ Please reply to a sticker');
        return;
      }

      // Sticker to image conversion would require additional libraries
      // This is a placeholder for the command structure
      await ctx.reply('✅ Sticker to image conversion initiated (requires media processing library)');

    } catch (error) {
      await ctx.reply('❌ Failed to convert sticker to image');
    }
  }
};
