# MULLER BOT

A production-ready WhatsApp bot built with **Baileys 6.7.18** and Node.js. Modular, secure, and easy to maintain.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-18+-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

---

## 🌟 Features

- ✅ **Modular Command System** - Easy to add/remove commands
- ✅ **Dynamic Command Loader** - Commands load automatically from files
- ✅ **Permission System** - USER, GROUP_ADMIN, BOT_ADMIN, OWNER levels
- ✅ **Group Management** - Kick, add, promote, demote members
- ✅ **Admin Tools** - Anti-link, welcome messages, goodbye messages, warnings
- ✅ **Secure Authentication** - Pairing code and QR code login support
- ✅ **Persistent Storage** - JSON-based store (easily replaceable with MongoDB/MySQL)
- ✅ **Error Handling** - Never crashes, handles all edge cases
- ✅ **Logging** - Safe logging without exposing secrets
- ✅ **Auto-reconnect** - Handles disconnections gracefully

---

## 📋 Requirements

- **Node.js** v18 or higher
- **npm** or **yarn**
- WhatsApp account
- Linux server / cPanel / VPS (for deployment)

---

## 🚀 Installation

### 1. Clone/Download the project

```bash
cd muller-bot
```

### 2. Install dependencies

```bash
npm install
```

This will install:
- `@whiskeysockets/baileys` 6.7.18 - WhatsApp bot framework (pairing-code support)
- `pino` - Logging
- `qrcode-terminal` - QR login fallback
- `sharp` / `ffmpeg-static` - media helpers

### 3. Create `.env` file

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
BOT_NAME=MULLER BOT
OWNER_NUMBER=234XXXXXXXXXX
PREFIX=.
MODE=public
AUTH_METHOD=pairing
PHONE_NUMBER=234XXXXXXXXXX
SESSION_DIR=./sessions
LOG_LEVEL=info
```

**⚠️ Important:**
- Replace `OWNER_NUMBER` with your WhatsApp number (digits only, with country code)
- Replace `PHONE_NUMBER` with the bot's WhatsApp number
- Set `AUTH_METHOD` to `pairing` (recommended) or `qr`
- Never commit `.env` to Git

### 4. Create required directories

```bash
mkdir -p sessions data
```

---

## 🔐 Authentication

### Option 1: Pairing Code (Recommended)

```bash
npm start
```

The bot will display a **pairing code** in the terminal. 

1. Open WhatsApp on your phone
2. Go to **Settings → Linked Devices → Link a Device**
3. Enter the pairing code shown in the terminal
4. The bot will authenticate and save the session

Next time you start the bot, it will use the saved session (no pairing needed).

### Option 2: QR Code

Change `.env`:

```env
AUTH_METHOD=qr
```

Run the bot:

```bash
npm start
```

Scan the QR code with WhatsApp. Session will be saved.

---

## ▶️ Running the Bot

### Development

```bash
npm start
```

### With PM2 (Production)

```bash
npm install -g pm2

pm2 start index.js --name "muller-bot"
pm2 save
pm2 startup
```

### Restart

```bash
pm2 restart muller-bot
```

### View logs

```bash
pm2 logs muller-bot
```

---

## 📁 Project Structure

```
muller-bot/
├── index.js              # Main entry point
├── package.json          # Dependencies
├── .env.example          # Configuration template
├── .gitignore            # Git ignore file
├── README.md             # This file
│
├── config/
│   └── config.js         # Configuration loader
│
├── handler/
│   ├── handler.js        # Main message handler
│   ├── connection.js     # WhatsApp connection
│   ├── commands.js       # Command loader
│   ├── events.js         # Event handlers
│   └── message.js        # Message processor
│
├── lib/
│   ├── logger.js         # Logging utility
│   ├── permissions.js    # Permission system
│   ├── utils.js          # Helper functions
│   ├── store.js          # JSON data store
│   └── database.js       # Database abstraction
│
├── commands/
│   ├── general/          # General commands (.ping, .menu, etc.)
│   ├── group/            # Group commands (.kick, .add, etc.)
│   ├── admin/            # Admin commands (.antilink, .warn, etc.)
│   ├── media/            # Media commands (.sticker, .toimg)
│   └── owner/            # Owner-only commands (.restart, .block, etc.)
│
├── data/                 # Data storage (JSON files)
│   └── db.json           # Database file
│
└── sessions/             # WhatsApp session files (DO NOT COMMIT)
```

---

## 💬 Available Commands

### General Commands
- `.ping` - Check bot response speed
- `.alive` - Check bot status and uptime
- `.menu` - Show all available commands
- `.owner` - Show bot owner contact
- `.botinfo` - Display bot information
- `.runtime` - Show bot uptime
- `.speed` - Measure bot speed/latency

### Group Commands
- `.groupinfo` - Display group information
- `.admins` - List all group admins
- `.tagall [message]` - Mention all members
- `.hidetag [message]` - Hidden mention all
- `.kick @user` - Kick member (bot admin only)
- `.add 234XXXXXXXXXX` - Add member (bot admin only)
- `.promote @user` - Promote to admin (bot admin only)
- `.demote @user` - Demote from admin (bot admin only)

### Admin Commands
- `.antilink on/off` - Enable/disable anti-link protection
- `.welcome on/off` - Enable/disable welcome messages
- `.welcome set [text]` - Set custom welcome message
- `.goodbye on/off` - Enable/disable goodbye messages
- `.goodbye set [text]` - Set custom goodbye message
- `.warn @user` - Warn a user
- `.warnings @user` - Check warnings for user

### Media Commands
- `.sticker` - Convert image to sticker (reply to image)
- `.toimg` - Convert sticker to image (reply to sticker)

### Owner Commands
- `.broadcast [message]` - Send broadcast message
- `.block @user or 234XXXXXXXXXX` - Block user
- `.unblock @user or 234XXXXXXXXXX` - Unblock user
- `.restart` - Restart the bot

---

## 🛠️ Adding New Commands

Commands are automatically loaded from the `commands/` directory.

### Command Structure

Create a new file in `commands/[category]/[command].js`:

```javascript
module.exports = {
  name: 'mycommand',
  aliases: ['alias1', 'alias2'],
  category: 'general',
  description: 'What this command does',
  usage: '.mycommand arg1 arg2',
  permission: 'USER', // Optional: USER, GROUP_ADMIN, BOT_ADMIN, OWNER
  groupOnly: false,   // Optional: restrict to groups only
  privateOnly: false, // Optional: restrict to private chat only

  async execute(ctx) {
    // ctx.sender - User ID
    // ctx.jid - Chat ID
    // ctx.groupId - Group ID (if group)
    // ctx.messageText - Message text
    // ctx.args - Command arguments
    // ctx.reply(text) - Send reply
    // ctx.sendMessage(text) - Send message
    // ctx.socket - Baileys socket
    // ctx.groupMetadata - Group info (if group)

    await ctx.reply('Response message');
  }
};
```

### Example: Custom Greeting Command

Create `commands/general/hello.js`:

```javascript
module.exports = {
  name: 'hello',
  aliases: ['hi', 'hey'],
  category: 'general',
  description: 'Say hello',
  usage: '.hello',

  async execute(ctx) {
    await ctx.reply(`👋 Hello ${ctx.senderName}!`);
  }
};
```

Restart the bot - the command loads automatically!

---

## 🔒 Security

The bot implements these security measures:

- ✅ **No hardcoded secrets** - Use `.env` only
- ✅ **Session files excluded from Git** - `.gitignore` configured
- ✅ **Safe logging** - No credentials in logs
- ✅ **Permission checking** - Every command validates permissions
- ✅ **Input validation** - Phone numbers, messages validated
- ✅ **Error handling** - Crashes prevented, graceful failures
- ✅ **Rate limiting** - Optional rate limiting support
- ✅ **Blocked users** - Owner can block users from using bot

### Best Practices

1. **Keep `.env` secret**
   ```bash
   # Never commit .env
   git add .gitignore
   ```

2. **Use strong owner number**
   - Make sure `OWNER_NUMBER` is correctly configured
   - Only owner can use admin commands

3. **Validate all inputs**
   - The bot validates phone numbers, messages, etc.
   - Commands should validate their arguments

4. **Keep dependencies updated**
   ```bash
   npm update
   npm audit
   ```

---

## 🔧 Configuration Options

Edit `.env` to customize:

| Variable | Default | Description |
|----------|---------|-------------|
| `BOT_NAME` | MULLER BOT | Bot display name |
| `OWNER_NUMBER` | 234XXXXXXXXXX | Owner's WhatsApp number |
| `PREFIX` | . | Command prefix |
| `MODE` | public | public or private |
| `AUTH_METHOD` | pairing | pairing or qr |
| `PHONE_NUMBER` | 234XXXXXXXXXX | Bot's WhatsApp number |
| `SESSION_DIR` | ./sessions | Session storage directory |
| `DATA_DIR` | ./data | Data storage directory |
| `LOG_LEVEL` | info | Log level (debug, info, warn, error) |

---

## 📊 Database

The bot uses JSON storage by default (file: `data/db.json`).

### Stored Data

```json
{
  "groups": {
    "group_id@g.us": {
      "antilink": false,
      "welcome": false,
      "welcomeMessage": "",
      "goodbye": false,
      "goodbyeMessage": "",
      "warnThreshold": 3
    }
  },
  "warnings": {
    "group_id@g.us": {
      "user_id@s.whatsapp.net": 2
    }
  },
  "blocks": {
    "user_id@s.whatsapp.net": true
  }
}
```

### Switching to MongoDB/MySQL

The `lib/database.js` is designed as an abstraction layer. To use MongoDB:

1. Install driver: `npm install mongodb`
2. Update `lib/database.js` to use MongoDB
3. All commands continue working without changes

---

## 🚀 Deployment

### Linux Server / VPS

1. Install Node.js v16+

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 16
nvm use 16
```

2. Clone project

```bash
git clone <repo-url> muller-bot
cd muller-bot
```

3. Setup

```bash
npm install
cp .env.example .env
# Edit .env with your config
nano .env
```

4. Start with PM2

```bash
npm install -g pm2
pm2 start index.js --name muller-bot
pm2 save
```

5. Auto-restart on reboot

```bash
pm2 startup
```

### Docker (Optional)

Create `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t muller-bot .
docker run -d --name muller-bot muller-bot
```

---

## 🐛 Troubleshooting

### Bot won't connect

- Check `PHONE_NUMBER` in `.env`
- Ensure WhatsApp is not logged in elsewhere
- Try clearing sessions: `rm -rf sessions/`
- Restart the bot

### Commands not loading

- Check command file syntax
- Ensure file has `.js` extension
- Check `commands/` directory structure
- View logs: `npm start`

### Permission denied errors

- Verify you're using `.OWNER_NUMBER`
- Check group admin status
- Ensure bot is group admin for admin commands

### Data not persisting

- Check `data/` directory exists
- Verify write permissions: `chmod 755 data/`
- Check `db.json` file exists

---

## 📝 License

MIT - Feel free to use and modify

---

## 👨‍💻 Built by

**MULLER TECH** - Web & Bot Development

- Discord/Telegram: [Your contact]
- GitHub: [Your profile]

---

## 📞 Support

For issues:
1. Check this README
2. Review the code comments
3. Check bot logs: `pm2 logs muller-bot`
4. Verify `.env` configuration

---

## 🔄 Version History

- **v1.0.0** (2024) - Initial release
  - Full command system
  - Group management
  - Admin tools
  - Secure authentication

---

**Last Updated:** 2024
**Maintained by:** Mullerdata

## 300+ functional command build

This build replaces the generated command placeholders with a shared execution engine. Local commands, group administration, protection settings, public web APIs, image processing, audio/video processing, games, WhatsApp utilities, and optional AI integrations are implemented.

### Install

```bash
npm install
npm start
```

Node.js 18+ is required. `sharp` is used for image processing and `ffmpeg-static` for audio/video processing.

### Optional integrations

Set `OPENAI_API_KEY` for AI commands. `OPENAI_BASE_URL` and `OPENAI_MODEL` are optional.

Downloader commands accept search terms/URLs and can be connected to a media extraction provider through `MEDIA_API_BASE_URL` without changing the command loader. News and Islamic commands similarly expose configurable provider variables.

### Examples

`.menu` — generated command menu
`.vv` — recover supported quoted view-once media
`.sticker` — image to WebP sticker
`.blur` — blur a replied image
`.resize 800` — resize a replied image
`.mp3` — convert replied video to MP3
`.weather Lagos` — live weather
`.wiki Nigeria` — Wikipedia summary
`.github WhiskeySockets` — GitHub profile
`.npm baileys` — npm package information
`.translate hello | fr` — translation
`.guessnumber new` — number game
`.tagall` — mention group members
`.antilink on` — enable group anti-link middleware
