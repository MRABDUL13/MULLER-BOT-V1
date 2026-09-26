module.exports = {
  name: 'restart',
  aliases: ['reboot'],
  category: 'owner',
  description: 'Restart the bot',
  usage: '.restart',
  permission: 'OWNER',

  async execute(ctx) {
    try {
      await ctx.reply('🔄 Restarting bot...');
      
      // Give time for message to send
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    } catch (error) {
      await ctx.reply('❌ Failed to restart bot');
    }
  }
};
