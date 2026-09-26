module.exports = {
  name: 'sticker',
  aliases: ['stick', 's'],
  category: 'media',
  description: 'Convert image to sticker',
  usage: '.sticker (reply to image)',

  async execute(ctx) {
    try {
      if (!ctx.quotedMessage) {
        await ctx.reply('❌ Please reply to an image to convert it to a sticker');
        return;
      }

      if (!ctx.quotedMessage.imageMessage) {
        await ctx.reply('❌ Please reply to an image');
        return;
      }

      // Sticker conversion would require additional libraries like sharp/ffmpeg
      // This is a placeholder for the command structure
      await ctx.reply('✅ Sticker conversion initiated (requires media processing library)');

    } catch (error) {
      await ctx.reply('❌ Failed to convert to sticker');
    }
  }
};
