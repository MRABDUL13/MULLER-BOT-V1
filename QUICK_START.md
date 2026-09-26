# MULLER BOT - Quick Start Guide

Get your bot running in 5 minutes! ⚡

## Step 1: Install Node.js

Check if you have Node.js v16+:

```bash
node --version
```

If not installed, install it from https://nodejs.org/

## Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages (only takes 30 seconds).

## Step 3: Configure

Copy the example file:

```bash
cp .env.example .env
```

Edit `.env` with your details:

```bash
nano .env
```

**Essential settings to change:**
```env
OWNER_NUMBER=234XXXXXXXXXX      # Your WhatsApp number (digits only)
PHONE_NUMBER=234YYYYYYYYY       # Bot's WhatsApp number (digits only)
AUTH_METHOD=pairing              # Recommended method
```

## Step 4: Run the Bot

```bash
npm start
```

You'll see something like:

```
[INFO] 🚀 Starting MULLER BOT...
[INFO] 💾 Store initialized
[INFO] ✅ Loaded 40 commands
[INFO] 🔐 Initializing WhatsApp connection...
[INFO] 🔄 Connecting to WhatsApp...
[INFO] 📱 Pairing code: 123-456-789
```

## Step 5: Pair with WhatsApp

1. **Open WhatsApp on your phone**
2. **Go to:** Settings → Linked Devices → Link a Device
3. **Enter the code** from terminal (e.g., `123-456-789`)
4. **Wait** for bot to connect

You'll see:
```
[INFO] ✅ MULLER BOT connected successfully!
```

## Step 6: Test the Bot

Send any message to the bot's number (from the number in `PHONE_NUMBER`):

```
.ping
```

Bot should respond:
```
╭━━━━━━━━━━━━━╮
┃ ⚡ PONG!
┃ Speed: 45ms
╰━━━━━━━━━━━━━╯
```

## Step 7: View All Commands

```
.menu
```

Bot shows all available commands organized by category.

---

## 🎮 Basic Commands

```bash
.ping              # Check bot speed
.alive             # Bot status
.menu              # Show all commands
.owner             # Owner contact
.groupinfo         # Group details (groups only)
.tagall            # Mention everyone (groups only)
.kick @user        # Remove member (groups, bot admin)
.antilink on/off   # Block group links (groups, admin)
.warn @user        # Warn user (groups, admin)
```

---

## 🛠️ Troubleshooting

### Bot won't connect?

1. **Check phone number format**
   ```
   ✅ Correct: 234XXXXXXXXXX (no +, no spaces)
   ❌ Wrong: +234XXXXXXXXXX or 234 XXXX XXXX
   ```

2. **Clear old sessions**
   ```bash
   rm -rf sessions/
   ```

3. **Restart bot**
   ```bash
   npm start
   ```

### Bot connected but won't respond?

1. Make sure you're messaging from the `PHONE_NUMBER` account
2. Try `.ping` command
3. Check bot is online: `.alive`

### Commands not showing?

1. Make sure prefix is correct (default: `.`)
2. Use `.menu` to see all commands
3. Check command syntax in README

---

## 📱 Using the Bot

### Send Command

In WhatsApp chat with bot:

```
.ping
```

### With Arguments

```
.tagall Morning meeting!
```

### Reply to Message

```
(reply to a message, then send)
.kick
```

---

## ⚙️ Change Configuration

Edit `.env` anytime (doesn't need restart):

```bash
nano .env
```

Change prefix:
```
PREFIX=!
```

Then use `!ping` instead of `.ping`

---

## 🚀 Production Setup

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start index.js --name "muller-bot"

# Save configuration
pm2 save

# Auto-start on system reboot
pm2 startup
```

### View Logs

```bash
pm2 logs muller-bot
```

### Stop Bot

```bash
pm2 stop muller-bot
```

### Restart Bot

```bash
pm2 restart muller-bot
```

---

## 📝 Adding Your First Command

1. Create file: `commands/general/hello.js`

2. Add this code:

```javascript
module.exports = {
  name: 'hello',
  category: 'general',
  description: 'Say hello',
  usage: '.hello',

  async execute(ctx) {
    await ctx.reply('👋 Hello ' + ctx.senderName + '!');
  }
};
```

3. Restart bot: `npm start`

4. Try it: `.hello`

Done! Your custom command works.

---

## 🔐 Security Tips

1. **Never share `.env` file**
   - Contains your WhatsApp credentials
   - Keep it private

2. **Don't commit sessions folder**
   - Already in `.gitignore`
   - Contains auth tokens

3. **Use strong OWNER_NUMBER**
   - Only owner can run admin commands
   - Protect this number

4. **Update dependencies**
   ```bash
   npm update
   npm audit
   ```

---

## 📞 Need Help?

1. Check README.md for detailed docs
2. Review command files in `commands/`
3. Check logs: `npm start` (shows errors)
4. Look at similar commands for examples

---

## 🎉 You're All Set!

Your bot is now running. Try:

- `.menu` - See all commands
- `.alive` - Check status
- `.groupinfo` - (in a group) Get group details
- `.help` - Get help

**Happy bot building!** 🚀

---

*For detailed documentation, read README.md*
