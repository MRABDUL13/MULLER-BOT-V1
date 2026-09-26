# MULLER BOT - Troubleshooting Guide

Comprehensive troubleshooting for common issues.

---

## 🔍 Diagnostic Tools

### Check Bot Status

```bash
# Using PM2
pm2 status
pm2 info muller-bot

# Check logs
pm2 logs muller-bot

# Monitor resources
pm2 monit
```

### Check Configuration

```bash
# View current config
node cli.js config

# Verify .env file
cat .env

# Test config loads
node -e "require('./config/config'); console.log('✅ Config OK')"
```

### Test Bot Connection

```bash
# Send test command
# Use WhatsApp to send: .ping

# Check if bot responds
# Expected: ⚡ PONG! Speed: XXms
```

---

## ⚠️ Common Issues & Solutions

### 1. Bot Won't Connect

**Symptoms:**
- Shows "Connecting..." but never connects
- Connection timeout errors
- "Could not connect to WhatsApp"

**Solutions:**

#### A. Check PHONE_NUMBER

```bash
# Edit .env
nano .env

# Verify format (no + or spaces)
# ❌ Wrong: +234XXXXXXXXXX or 234 XXXX XXXX
# ✅ Correct: 234XXXXXXXXXX
```

#### B. Clear sessions and re-authenticate

```bash
# Stop bot
pm2 stop muller-bot

# Clear old sessions
node cli.js clear-sessions

# Start bot
npm start

# Follow pairing code on screen
# (Scan with WhatsApp settings)
```

#### C. Check internet connection

```bash
# Test connectivity
ping 8.8.8.8
ping api.whatsapp.com

# Should get response
```

#### D. Check WhatsApp status

- Make sure WhatsApp is not logged in elsewhere
- Update WhatsApp to latest version
- Try on different device if available

#### E. Check logs for specific error

```bash
pm2 logs muller-bot --err | head -50

# Look for specific error messages
# Common: "Bad session", "Connection rejected", "MultideviceMismatch"
```

---

### 2. Bot Connects But Won't Respond

**Symptoms:**
- Bot is online but doesn't reply to messages
- Only replies to some users
- Commands return "Unknown"

**Solutions:**

#### A. Verify message format

```bash
# Messages must start with prefix
# Default prefix: .

# ✅ Correct: .ping
# ❌ Wrong: ping or !ping (if prefix is .)
```

#### B. Check if commands loaded

```bash
# Send: .menu
# Bot should show list of commands

# If no response:
# Stop and restart
pm2 restart muller-bot

# Check logs
pm2 logs muller-bot | grep "Loaded"
```

#### C. Check user is not blocked

```bash
# List blocked users
node cli.js list-blocked

# If you're blocked:
# Owner only command
node cli.js unblock YOURNUMBER
```

#### D. Verify command exists

```bash
# List commands in code
ls commands/*/

# Count commands
ls commands/*/*.js | wc -l

# Should be 30+ files
```

---

### 3. Commands Not Working

**Symptoms:**
- Command loads but crashes
- "❌ Failed to execute command"
- Command works sometimes

**Solutions:**

#### A. Check command file syntax

```bash
# Validate JavaScript syntax
node -c commands/general/ping.js

# Should say: ✅ Syntax OK
```

#### B. Check command permissions

```bash
# Command requires permission
# Example: .kick needs GROUP_ADMIN

# Check your role
# In group: Are you group admin?
# Owner commands: Are you OWNER_NUMBER?
```

#### C. Check command requirements

```bash
# Group-only commands
# .kick only works in groups

# Private-only commands
# Some commands private chat only

# Check .groupOnly and .privateOnly
```

#### D. Review command logic

```bash
# Check for errors
pm2 logs muller-bot --err

# Look for specific command error
grep "command-name" /path/to/logs
```

---

### 4. Memory/Performance Issues

**Symptoms:**
- Bot gets slow over time
- Memory usage keeps increasing
- Bot crashes randomly

**Solutions:**

#### A. Check memory usage

```bash
# Monitor in real-time
pm2 monit

# Or check single snapshot
pm2 info muller-bot | grep Memory

# High: > 200MB indicates issue
```

#### B. Restart bot to free memory

```bash
# Graceful restart
pm2 restart muller-bot

# Force restart (if stuck)
pm2 kill muller-bot
npm start
```

#### C. Clear cache

```bash
# Cache can grow with usage
# Cache auto-expires, but you can clear

# In code:
const cache = require('./lib/cache');
cache.clear();
```

#### D. Check for memory leaks

```bash
# Look for listeners that aren't unsubscribed
# Check lib/events.js usage

# Verify backups aren't accumulating
node cli.js list-backups

# Clean old backups
node -e "require('./lib/backup').cleanupOldBackups(10)"
```

---

### 5. Database Issues

**Symptoms:**
- Data not saving
- Lost data after restart
- "Cannot read property..."

**Solutions:**

#### A. Verify database file exists

```bash
# Check if file exists
ls -la data/db.json

# If missing, bot will recreate on startup
```

#### B. Check file permissions

```bash
# Give write permission
chmod 755 data/
chmod 644 data/db.json

# Verify
ls -la data/db.json
```

#### C. Test database operations

```bash
# Manually test save
node -e "
const store = require('./lib/store');
store.initialize().then(() => {
  store.data.test = 'value';
  store.save().then(() => console.log('✅ Save works'));
});
"
```

#### D. Restore from backup

```bash
# If database corrupted
node cli.js backup   # Create current backup
node cli.js restore data/backups/backup-YYYY-MM-DD.json

# Verify
cat data/db.json | head
```

---

### 6. Permission Errors

**Symptoms:**
- "❌ You do not have permission"
- Command won't work even for admin
- Owner commands not responding

**Solutions:**

#### A. Verify OWNER_NUMBER

```bash
# Check .env
cat .env | grep OWNER_NUMBER

# Should be your WhatsApp number
# Format: 234XXXXXXXXXX (no + or spaces)

# Update if wrong
nano .env
pm2 restart muller-bot
```

#### B. Check bot admin status

```bash
# Some commands need bot to be admin
# In group: Make bot group admin

# Try command
# If still fails: .kick @user

# Should show error: "❌ Bot must be group admin"
```

#### C. Verify group admin role

```bash
# For admin commands
# Check you're group admin in WhatsApp

# Try: .antilink on
# Should work if you're admin
```

---

### 7. Deployment Issues (Server)

**Symptoms:**
- Bot works locally but not on server
- Can't connect to server
- SSH timeout

**Solutions:**

#### A. Check SSH access

```bash
# From local machine
ssh user@server-ip

# If fails: Verify IP, user, credentials
# Check server firewall allows port 22
```

#### B. Verify Node.js installed

```bash
# On server
node --version   # Should be v16 or higher
npm --version

# If not installed:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 16
```

#### C. Check file permissions

```bash
# On server, in bot directory
ls -la

# sessions/ and data/ should be writable
chmod 755 sessions/ data/

# .env should be readable only by user
chmod 600 .env
```

#### D. Verify .env on server

```bash
# SSH to server
ssh user@server

# Check if .env exists
cat muller-bot/.env

# Should have OWNER_NUMBER and PHONE_NUMBER set
```

#### E. Test locally first

```bash
# Always test: npm start locally
# Then deploy to server

# Common mistakes:
# - Wrong PHONE_NUMBER
# - Missing .env
# - Wrong file permissions
# - Node.js version mismatch
```

---

## 🔧 Advanced Debugging

### Enable Debug Logging

```bash
# Set log level to debug
# Edit .env
LOG_LEVEL=debug

# Restart
pm2 restart muller-bot

# View debug logs
pm2 logs muller-bot | grep DEBUG
```

### Monitor Network

```bash
# Check if WhatsApp API accessible
curl -I https://api.whatsapp.com

# Should return HTTP 200 OK
```

### Test Commands Directly

```bash
# Test command without messages
node -e "
const cmd = require('./commands/general/ping.js');
const mockCtx = {
  reply: async (msg) => console.log(msg),
  socket: {},
  args: [],
};
cmd.execute(mockCtx);
"
```

### Check Baileys Version

```bash
npm list @whiskeysockets/baileys

# Should show: 7.0.0-rc.14
```

---

## 📋 Health Check

### Run Diagnostic

```bash
# Create diagnostic script
cat > diagnose.js << 'EOF'
const config = require('./config/config');
const logger = require('./lib/logger');

console.log('📊 MULLER BOT Diagnostics\n');

console.log('✅ Configuration:');
console.log(`  - Bot Name: ${config.BOT_NAME}`);
console.log(`  - Owner: ${config.OWNER_NUMBER}`);
console.log(`  - Prefix: ${config.PREFIX}`);

console.log('\n✅ File System:');
const fs = require('fs');
console.log(`  - sessions exists: ${fs.existsSync(config.SESSION_DIR)}`);
console.log(`  - data exists: ${fs.existsSync(config.DATA_DIR)}`);
console.log(`  - db.json exists: ${fs.existsSync(config.DB_PATH)}`);

console.log('\n✅ Dependencies:');
try {
  require('@whiskeysockets/baileys');
  console.log('  - Baileys: ✅');
  require('dotenv');
  console.log('  - dotenv: ✅');
  require('pino');
  console.log('  - pino: ✅');
} catch (e) {
  console.log('  - Missing dependencies:', e.message);
}

console.log('\n✅ Diagnostics complete');
EOF

node diagnose.js
```

### View Full Status

```bash
# Complete bot info
echo "=== Bot Status ===" && \
pm2 info muller-bot && \
echo -e "\n=== Disk Usage ===" && \
du -sh muller-bot/ && \
echo -e "\n=== Latest Logs ===" && \
pm2 logs muller-bot --lines 20
```

---

## 🆘 When All Else Fails

### Nuclear Option (Fresh Start)

```bash
# ⚠️ WARNING: This deletes everything!
# Only if nothing else works

# 1. Backup everything
node cli.js backup
tar -czf complete-backup.tar.gz muller-bot/

# 2. Stop bot
pm2 stop muller-bot

# 3. Clear everything
rm -rf sessions/ data/db.json

# 4. Recreate directories
mkdir -p sessions data

# 5. Start fresh
npm start

# 6. Follow pairing instructions
```

### Get Support

```bash
# Collect diagnostic info for support
echo "=== Collecting Diagnostics ===" && \
echo "Node version: $(node --version)" && \
echo "Npm version: $(npm --version)" && \
echo "Bot version: $(grep '"version"' package.json)" && \
echo "Config: $(node -e 'const c = require("./config/config"); console.log(JSON.stringify({BOT_NAME: c.BOT_NAME, MODE: c.MODE, PREFIX: c.PREFIX}))')" && \
pm2 logs muller-bot --lines 50 > bot-logs.txt && \
echo "✅ Diagnostics saved to bot-logs.txt"
```

---

## 📞 Getting Help

### Checklist Before Asking for Help

- [ ] Checked logs: `pm2 logs muller-bot`
- [ ] Verified .env configuration
- [ ] Confirmed Node.js version (v16+)
- [ ] Tested with `.ping` command
- [ ] Tried restarting: `pm2 restart muller-bot`
- [ ] Cleared sessions if connection issues
- [ ] Checked file permissions
- [ ] Ran diagnostics script

### Information to Provide

1. **Error message** (exact text)
2. **When it happens** (specific action)
3. **Diagnostic output** (see section above)
4. **Your setup** (server/local, OS)
5. **Steps to reproduce** (what you did)

---

## 🎯 Prevention

### Regular Maintenance

```bash
# Weekly
node cli.js list-backups
pm2 logs muller-bot | grep ERROR

# Monthly
npm audit
npm update

# Quarterly
pm2 flush
pm2 save
```

### Monitoring

```bash
# Setup logging
pm2 start index.js --log-file logs/bot.log

# Watch for errors
tail -f logs/bot.log | grep ERROR

# Monitor resources
pm2 monit
```

---

Made with ❤️ for Mullerdata  
**Last Updated**: 2024  
**Version**: 1.0.0
