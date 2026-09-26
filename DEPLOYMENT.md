# MULLER BOT - Deployment Guide

Deploy MULLER BOT to cPanel, Linux VPS, or dedicated server.

---

## 📋 Prerequisites

- cPanel/WHM hosting OR Linux VPS
- SSH access
- Node.js support (or terminal access to install it)
- Minimum 512MB RAM
- Stable internet connection

---

## 🚀 Deployment Methods

## Method 1: cPanel with Terminal Access

### 1.1 SSH into Server

```bash
ssh username@your-domain.com
```

### 1.2 Navigate to Home Directory

```bash
cd ~
```

### 1.3 Install Node.js (if not installed)

```bash
# Check if Node.js is installed
node --version

# If not, use NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js v16
nvm install 16
nvm use 16
```

### 1.4 Clone Project

```bash
# Clone from repository
git clone https://github.com/yourusername/muller-bot.git
cd muller-bot

# OR upload files via SFTP/FTP
# Then navigate to the folder
```

### 1.5 Install Dependencies

```bash
npm install --production
```

### 1.6 Configure

```bash
cp .env.example .env
nano .env
```

Edit these critical settings:

```env
BOT_NAME=MULLER BOT
OWNER_NUMBER=234XXXXXXXXXX
PHONE_NUMBER=234YYYYYYYYY
PREFIX=.
MODE=public
AUTH_METHOD=pairing
SESSION_DIR=/home/username/muller-bot/sessions
DATA_DIR=/home/username/muller-bot/data
LOG_LEVEL=info
```

**Replace `username` with your cPanel username**

### 1.7 Initial Pairing

First time, run interactively:

```bash
npm start
```

1. Wait for pairing code
2. Copy the code (e.g., `123-456-789`)
3. Go to WhatsApp → Linked Devices → Link a Device
4. Enter the pairing code
5. Bot connects automatically
6. Press `Ctrl+C` to stop (session is saved)

### 1.8 Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### 1.9 Start Bot with PM2

```bash
pm2 start index.js --name "muller-bot"
```

### 1.10 Save PM2 Configuration

```bash
pm2 save
```

### 1.11 Setup Auto-start on Reboot

```bash
pm2 startup
```

**Follow the commands shown in output** - usually something like:

```bash
sudo env PATH=$PATH:/home/username/.nvm/versions/node/v16.x.x/bin /home/username/.nvm/versions/node/v16.x.x/lib/node_modules/pm2/bin/pm2 startup systemd -u username --hp /home/username
```

---

## Method 2: Linux VPS (Ubuntu/Debian)

### 2.1 SSH to Server

```bash
ssh root@your-server-ip
```

### 2.2 Update System

```bash
apt update && apt upgrade -y
```

### 2.3 Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y nodejs
```

### 2.4 Create App Directory

```bash
mkdir -p /opt/muller-bot
cd /opt/muller-bot
```

### 2.5 Upload Files

Option A: Git clone

```bash
git clone https://github.com/yourusername/muller-bot.git .
```

Option B: SFTP/SCP

```bash
# From your local machine
scp -r muller-bot/ root@server-ip:/opt/muller-bot/
```

### 2.6 Install Dependencies

```bash
npm install --production
```

### 2.7 Configure

```bash
cp .env.example .env
nano .env
```

### 2.8 Install PM2

```bash
npm install -g pm2
pm2 install pm2-logrotate
```

### 2.9 Start Bot

```bash
pm2 start index.js --name "muller-bot"
pm2 save
pm2 startup
```

### 2.10 Firewall (Optional)

```bash
# Allow SSH, HTTP, HTTPS
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

---

## Method 3: Docker Deployment

### 3.1 Create Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

# Install git (for cloning)
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application
COPY . .

# Create directories
RUN mkdir -p sessions data

# Start bot
CMD ["npm", "start"]
```

### 3.2 Create .dockerignore

```
node_modules
npm-debug.log
sessions
data
.env
.git
.gitignore
```

### 3.3 Build Docker Image

```bash
docker build -t muller-bot:latest .
```

### 3.4 Run Container

```bash
docker run -d \
  --name muller-bot \
  -e OWNER_NUMBER=234XXXXXXXXXX \
  -e PHONE_NUMBER=234YYYYYYYYY \
  -v muller-bot-sessions:/app/sessions \
  -v muller-bot-data:/app/data \
  muller-bot:latest
```

### 3.5 View Logs

```bash
docker logs -f muller-bot
```

---

## 🔄 Managing Bot

### View Status

```bash
pm2 status
pm2 info muller-bot
```

### View Logs

```bash
pm2 logs muller-bot
pm2 logs muller-bot --lines 100
```

### Restart Bot

```bash
pm2 restart muller-bot
```

### Stop Bot

```bash
pm2 stop muller-bot
```

### Start Bot

```bash
pm2 start muller-bot
```

### Delete from PM2

```bash
pm2 delete muller-bot
```

### Monitor Resources

```bash
pm2 monit
```

---

## 📊 Health Check

### Test Bot is Running

```bash
ps aux | grep "node index.js"
```

Should show:
```
username  1234  0.0  0.5 234567 12345 ?  Ssl  12:34  0:05 node index.js
```

### Check PM2

```bash
pm2 status
```

Should show:
```
muller-bot  online
```

### Verify Session File

```bash
ls -la sessions/
```

Should contain WhatsApp session files.

---

## 🔧 Maintenance

### Update Bot Code

```bash
cd /path/to/muller-bot

# Pull latest code
git pull origin main

# Install any new dependencies
npm install --production

# Restart bot
pm2 restart muller-bot
```

### Update Node.js

```bash
# Check current version
node --version

# Update via NVM
nvm install 16
nvm use 16

# Restart PM2
pm2 restart muller-bot
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all
npm update

# Restart
pm2 restart muller-bot
```

### Clear Old Logs

```bash
pm2 flush
```

### Backup Database

```bash
# Backup data
cp data/db.json data/db.json.backup.$(date +%Y%m%d)

# Backup sessions
tar -czf sessions.backup.tar.gz sessions/
```

---

## ⚠️ Troubleshooting

### Bot Not Starting

```bash
# Check logs
pm2 logs muller-bot --err

# Check Node.js
node --version

# Check npm packages
npm list baileys

# Try running directly
node index.js
```

### Connection Issues

```bash
# Check internet
ping 8.8.8.8

# Clear sessions and restart
rm -rf sessions/
pm2 restart muller-bot
```

### Permission Denied

```bash
# Fix directory permissions
chmod 755 sessions/
chmod 755 data/

# Or recursively
chmod -R 755 /path/to/muller-bot
```

### Out of Memory

```bash
# Check memory usage
free -h

# Monitor bot memory
pm2 monit

# Restart PM2
pm2 restart muller-bot
```

### Port Already in Use

WhatsApp bot doesn't use ports, but if you add web interface:

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

---

## 🛡️ Security

### File Permissions

```bash
# Only owner can read .env
chmod 600 .env

# Sessions directory private
chmod 700 sessions/
```

### Regular Backups

```bash
# Backup cron job
0 2 * * * tar -czf /backup/muller-bot-$(date +\%Y\%m\%d).tar.gz /opt/muller-bot/data /opt/muller-bot/sessions
```

### Monitor Logs

```bash
# Check for errors
pm2 logs muller-bot | grep ERROR

# Monitor connections
pm2 logs muller-bot | grep connected
```

---

## 📈 Scaling

### Multiple Bots

```bash
# Bot 1
pm2 start index.js --name "bot1"

# Bot 2 (different port/config)
BOT_NAME="Bot 2" pm2 start index.js --name "bot2"
```

### Load Balancing (Advanced)

Use Nginx/Apache to proxy requests (if adding API).

---

## 🔗 Useful Commands Reference

```bash
# Install
npm install --production

# Start
npm start

# Test
npm test (if available)

# PM2 Commands
pm2 start index.js --name "muller-bot"
pm2 logs muller-bot
pm2 restart muller-bot
pm2 stop muller-bot
pm2 delete muller-bot
pm2 status

# System Commands
ps aux | grep node
kill -9 <PID>
df -h (disk space)
free -h (memory)
uptime

# File Management
chmod 755 filename
chown user:group filename
tar -czf archive.tar.gz folder/
tar -xzf archive.tar.gz
```

---

## 📞 Support

For deployment issues:

1. Check `.pm2/logs/` directory
2. Run `pm2 logs muller-bot` for detailed errors
3. Verify `.env` configuration
4. Check Node.js version with `node --version`
5. Ensure WhatsApp session hasn't expired

---

## 🎉 Deployment Complete!

Your MULLER BOT is now deployed and running 24/7!

Monitor logs regularly and keep the bot updated for best performance.

**Happy deployment!** 🚀

---

*Last Updated: 2024*
*For more info, see README.md*
