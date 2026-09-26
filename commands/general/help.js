module.exports = {
  name: 'help',
  aliases: ['h', '?'],
  category: 'general',
  description: 'Get help about commands',
  usage: '.help [command]',

  async execute(ctx) {
    try {
      if (ctx.args.length === 0) {
        const response = `📚 HELP SYSTEM

Use: .help [command]

Examples:
.help ping       - Get help for .ping command
.help tagall     - Get help for .tagall command
.help warn       - Get help for .warn command

Or use: .menu    - See all commands with descriptions
`;
        await ctx.reply(response);
        return;
      }

      const commandName = ctx.args[0].toLowerCase();
      const response = `📖 Help for: ${commandName}

This feature shows detailed help for specific commands.

To implement:
1. Add 'help' property to command structure
2. Return detailed usage and examples
3. Show permission requirements
4. Show any special notes

Try: .menu to see all commands`;

      await ctx.reply(response);
    } catch (error) {
      await ctx.reply('❌ Failed to load help');
    }
  }
};
