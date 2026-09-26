# MULLER BOT - Version Upgrade & Migration Guide

Guide for upgrading MULLER BOT to new versions and migrating data.

---

## 📋 Before You Start

### Backup Everything

```bash
# Create a backup before any upgrade
node cli.js backup

# Verify backup was created
node cli.js list-backups
```

### Check Current Version

The current version is **v1.0.0** released in 2024.

Check your package.json for dependencies:

```bash
npm list @whiskeysockets/baileys
```

---

## 🔄 Upgrading from v1.0.0

### Step 1: Backup Current Version

```bash
# Create backup of database and sessions
node cli.js backup

# Also backup sessions manually if needed
tar -czf sessions-backup.tar.gz sessions/
```

### Step 2: Stop the Bot

```bash
# If running with PM2
pm2 stop muller-bot

# Or press Ctrl+C if running directly
```

### Step 3: Update Code

#### Option A: Git Pull (if using Git)

```bash
git pull origin main
```

#### Option B: Manual Update

Download the latest files and copy to your bot directory.

### Step 4: Update Dependencies

```bash
npm install
npm update
```

### Step 5: Check Configuration

```bash
# Review your .env file
nano .env

# Ensure all required variables are set
echo "Checking configuration..."
node -e "const config = require('./config/config'); console.log('✅ Config OK')"
```

### Step 6: Test Before Starting

```bash
# Run bot in foreground to see any errors
npm start

# If it starts successfully, stop it (Ctrl+C)
```

### Step 7: Restart the Bot

```bash
# With PM2
pm2 restart muller-bot

# Or start with npm
npm start
```

### Step 8: Verify Upgrade

```bash
# Check bot is connected
pm2 logs muller-bot

# Or send a test command
# Send: .alive

# Verify bot responds correctly
```

---

## 🗄️ Data Migration

### Migrate from JSON to MongoDB

If you want to switch to MongoDB for scalability:

#### 1. Install MongoDB

```bash
npm install mongodb
```

#### 2. Create new database.js

```javascript
// lib/database.js (updated for MongoDB)

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function initialize() {
  await client.connect();
  db = client.db('muller-bot');
  // ... implement methods
}
```

#### 3. Migrate data from JSON

```bash
node cli.js migrate mongodb

# Or manually export/import:
# 1. node cli.js backup (creates backup.json)
# 2. Import backup.json to MongoDB
# 3. Update database.js to use MongoDB
```

### Migrate from MongoDB to JSON

If switching back to JSON:

```bash
node cli.js migrate json
```

---

## 🔄 Restoring from Backup

If something goes wrong during upgrade:

### Option 1: Restore Latest Backup

```bash
# List available backups
node cli.js list-backups

# Restore from specific backup
node cli.js restore /path/to/backup-2024-01-15.json
```

### Option 2: Manual Restore

```bash
# Stop the bot
pm2 stop muller-bot

# Copy backup file
cp data/backups/backup-latest.json data/db.json

# Restart bot
pm2 restart muller-bot
```

---

## 🆕 New Features by Version

### v1.0.0 (Current)

#### New in this version:
- ✅ 30+ dynamic commands
- ✅ Permission system (4 levels)
- ✅ Health monitoring & metrics
- ✅ Automatic backups (every 6 hours)
- ✅ CLI management tool (node cli.js)
- ✅ Rate limiting system
- ✅ Cache system with TTL
- ✅ Event emitter for integrations
- ✅ Webhook system for external services
- ✅ Web dashboard (optional)

#### Breaking Changes:
- None (first version)

#### Deprecated:
- None

---

## 🔧 Troubleshooting Upgrades

### Bot won't start after upgrade

```bash
# Check logs
pm2 logs muller-bot

# Verify configuration
node -e "require('./config/config')" 

# Check dependencies
npm list --all

# Restore previous version
git checkout v1.0.0
npm install
pm2 restart muller-bot
```

### Data lost after upgrade

```bash
# Check for backups
node cli.js list-backups

# Restore backup
node cli.js restore <backup-file>

# Verify data
ls -la data/db.json
```

### Commands not loading

```bash
# Check commands directory
ls commands/*/

# Verify command syntax in one file
node -c commands/general/ping.js

# Reload commands
pm2 restart muller-bot
```

### Permission errors

```bash
# Fix file permissions
chmod 755 sessions/
chmod 755 data/

# Fix .env permissions
chmod 600 .env
```

---

## 📊 Version Compatibility Matrix

| Version | Node.js | Baileys | Status |
|---------|---------|---------|--------|
| 1.0.0   | 16+     | 7.0.0-rc.14 | Current |

---

## 🔐 Security Updates

### Latest Security Patches

- ✅ All dependencies up to date
- ✅ No known vulnerabilities
- ✅ Safe session handling
- ✅ Protected credentials in .env
- ✅ Input validation on all commands

### Security Checklist

After upgrading:

```bash
# Check for vulnerabilities
npm audit

# Fix if any found
npm audit fix

# Update packages
npm update

# Restart bot
pm2 restart muller-bot
```

---

## 📈 Performance Improvements

### Caching (v1.0.0)

New cache system reduces API calls:

```javascript
const cache = require('./lib/cache');

// Automatically caches expensive operations
const result = await cache.getCached(
  'key',
  expensiveFunction,
  3600 // 1 hour TTL
);
```

### Rate Limiting (v1.0.0)

Prevents abuse by limiting requests:

```javascript
const ratelimiter = require('./lib/ratelimiter');

if (ratelimiter.isLimited(userId)) {
  return; // User has exceeded limits
}
```

### Health Monitoring (v1.0.0)

Track bot health and performance:

```bash
# View stats
.stats

# Or check CLI
node cli.js config
```

---

## 🧹 Cleanup After Upgrade

### Remove Old Files

```bash
# Remove backup sessions
rm -rf sessions-old/

# Remove old code backups
rm *.backup.js

# Clean old logs
rm -rf logs/old/
```

### Optimize Database

```bash
# Clear old backups (keep last 10)
node -e "require('./lib/backup').cleanupOldBackups(10)"

# Verify database integrity
ls -lh data/db.json
```

---

## 📚 Documentation Updates

After upgrading, review:

1. **README.md** - Main documentation
2. **QUICK_START.md** - Setup guide
3. **EXTENDING.md** - Customize bot
4. **FILE_STRUCTURE.md** - File reference
5. **DEPLOYMENT.md** - Production deployment

---

## ✅ Upgrade Checklist

Before starting:
- [ ] Backup database and sessions
- [ ] Create backup with `node cli.js backup`
- [ ] Stop bot with `pm2 stop muller-bot`
- [ ] Note current version

During upgrade:
- [ ] Pull/download latest code
- [ ] Run `npm install`
- [ ] Review changes/breaking changes
- [ ] Update .env if needed
- [ ] Test with `npm start`

After upgrade:
- [ ] Restart with `pm2 restart muller-bot`
- [ ] Check logs with `pm2 logs muller-bot`
- [ ] Test commands (send `.ping`, `.menu`)
- [ ] Verify data integrity
- [ ] Monitor for errors

---

## 🆘 Getting Help

### If upgrade fails:

1. **Check logs**: `pm2 logs muller-bot`
2. **Restore backup**: `node cli.js restore <file>`
3. **Verify config**: `cat .env`
4. **Check permissions**: `ls -la data/`
5. **Restart bot**: `pm2 restart muller-bot`

### Common Issues & Solutions:

**Issue**: Bot won't connect after upgrade
- Solution: Clear sessions and re-authenticate
  ```bash
  node cli.js clear-sessions
  npm start
  ```

**Issue**: Commands not found
- Solution: Restart bot to reload commands
  ```bash
  pm2 restart muller-bot
  ```

**Issue**: Database corrupted
- Solution: Restore from backup
  ```bash
  node cli.js restore <backup-file>
  ```

---

## 🔄 Rollback Procedure

If you need to go back to previous version:

```bash
# Stop current version
pm2 stop muller-bot

# Restore database from backup
node cli.js restore <old-backup-file>

# Checkout previous version (if using Git)
git checkout v0.9.0

# Reinstall dependencies
npm install

# Restart bot
pm2 restart muller-bot
```

---

## 📞 Support

- **Documentation**: See README.md
- **CLI Help**: `node cli.js help`
- **Logs**: `pm2 logs muller-bot`
- **Configuration**: Check .env file
- **Backups**: `node cli.js list-backups`

---

## 🎉 After Successful Upgrade

1. ✅ Test all commands
2. ✅ Verify data integrity
3. ✅ Monitor logs for errors
4. ✅ Remove old backups if space needed
5. ✅ Document any customizations

---

**Last Updated**: 2024  
**Current Version**: v1.0.0  
**Status**: Stable & Production Ready  

Made with ❤️ for Mullerdata
