# MULLER BOT - Extending & Customization Guide

Complete guide to extending MULLER BOT with custom commands, integrations, and features.

---

## 📚 Table of Contents

1. [Creating Custom Commands](#creating-custom-commands)
2. [Using the Utilities](#using-the-utilities)
3. [Database Operations](#database-operations)
4. [Advanced Features](#advanced-features)
5. [Best Practices](#best-practices)
6. [Integration Examples](#integration-examples)

---

## 🎮 Creating Custom Commands

### Basic Command Structure

```javascript
// commands/category/mycommand.js

module.exports = {
  name: 'mycommand',
  aliases: ['my', 'cmd'],
  category: 'general',
  description: 'What this does',
  usage: '.mycommand [args]',
  
  // Optional: Permission level
  permission: 'USER', // USER, GROUP_ADMIN, BOT_ADMIN, OWNER
  
  // Optional: Restrict to groups/private
  groupOnly: false,
  privateOnly: false,

  async execute(ctx) {
    // Your command logic here
    await ctx.reply('Response message');
  }
};
```

### Command Context (ctx) Properties

```javascript
// Message info
ctx.sender              // User ID who sent message
ctx.senderName         // User's display name
ctx.jid                // Chat ID (group or private)
ctx.groupId            // Group ID (null if private)
ctx.messageText        // Message text
ctx.messageType        // Message type (text, image, etc)
ctx.isGroup            // Is this a group message?
ctx.isReply            // Is this a reply to another message?

// Message & group data
ctx.message            // Raw message object
ctx.key                // Message key
ctx.quotedMessage      // Quoted/replied message (if any)
ctx.groupMetadata      // Group info (if in group)
ctx.args               // Command arguments array

// Socket & methods
ctx.socket             // Baileys socket (advanced)
ctx.reply(text)        // Send reply to message
ctx.sendMessage(text)  // Send new message
ctx.replyWithMention(text, mentions) // Send with mentions
```

### Simple Command Example

```javascript
module.exports = {
  name: 'hello',
  category: 'general',
  description: 'Say hello',
  usage: '.hello',

  async execute(ctx) {
    await ctx.reply(`👋 Hello, ${ctx.senderName}!`);
  }
};
```

### Command with Arguments

```javascript
module.exports = {
  name: 'greet',
  category: 'general',
  description: 'Greet someone',
  usage: '.greet [name]',

  async execute(ctx) {
    if (ctx.args.length === 0) {
      await ctx.reply('❌ Usage: .greet [name]');
      return;
    }

    const name = ctx.args.join(' ');
    await ctx.reply(`👋 Hello, ${name}!`);
  }
};
```

### Command with Permission Check

```javascript
module.exports = {
  name: 'broadcast',
  category: 'owner',
  description: 'Send message to all',
  usage: '.broadcast [text]',
  permission: 'OWNER', // Only owner can use
  groupOnly: false,    // Can use in private chat

  async execute(ctx) {
    const message = ctx.args.join(' ');
    // Only owner reaches here
    await ctx.reply(`📢 Broadcasting: ${message}`);
  }
};
```

### Command with Database

```javascript
const database = require('../../lib/database');

module.exports = {
  name: 'setgreeting',
  category: 'admin',
  description: 'Set group greeting',
  usage: '.setgreeting [text]',
  permission: 'GROUP_ADMIN',
  groupOnly: true,

  async execute(ctx) {
    if (ctx.args.length === 0) {
      await ctx.reply('❌ Usage: .setgreeting [text]');
      return;
    }

    const greeting = ctx.args.join(' ');
    
    // Save to database
    await database.updateGroupSetting(ctx.groupId, 'greeting', greeting);
    
    await ctx.reply('✅ Greeting updated');
  }
};
```

---

## 🛠️ Using the Utilities

### Logger

```javascript
const logger = require('../../lib/logger');

// Log messages
logger.info('Bot started');
logger.warn('Warning message');
logger.error('Error occurred', error);
logger.debug('Debug info');

// Log commands
logger.logCommand('ping', ctx.sender, ctx.groupId);
logger.logPermissionDenied('kick', ctx.sender, 'not admin');
logger.logCommandError('badcommand', error);
```

### Utils (lib/utils.js)

```javascript
const {
  formatTime,
  getUptime,
  parseCommand,
  isValidPhoneNumber,
  normalizePhoneNumber,
  isFromGroup,
  isUrl,
  boxMessage,
  sleep,
  escapeMessage,
} = require('../../lib/utils');

// Format uptime
const uptime = getUptime(); // Returns "1h 23m 45s"

// Parse phone numbers
if (isValidPhoneNumber('234XXXXXXXXXX')) {
  const normalized = normalizePhoneNumber('234XXXXXXXXXX');
}

// Format messages
const box = boxMessage('Title', 'Line 1', 'Line 2');
await ctx.reply(box);

// Check URLs
if (isUrl('https://example.com')) {
  // Handle URL
}

// Delay
await sleep(1000); // Wait 1 second
```

### Cache System

```javascript
const cache = require('../../lib/cache');

// Set value (no expiry)
cache.set('key', 'value');

// Set with TTL (expires after 1 hour)
cache.set('key', 'value', 3600);

// Get value
const value = cache.get('key');

// Check if exists
if (cache.has('key')) {
  // Use cached value
}

// Cache function result
const result = await cache.getCached(
  'cacheKey',
  async () => {
    // Function is called if not in cache
    return await expensiveOperation();
  },
  3600 // Cache for 1 hour
);

// Clear specific key or all
cache.delete('key');
cache.clear();

// Get stats
console.log(cache.getStats()); // { size: 5, withTTL: 3 }
```

### Rate Limiter

```javascript
const ratelimiter = require('../../lib/ratelimiter');

// Check if user is rate limited
if (ratelimiter.isLimited(ctx.sender)) {
  await ctx.reply('❌ You\'re doing that too fast. Please wait.');
  return;
}

// Get remaining requests
const remaining = ratelimiter.getRemaining(ctx.sender);
await ctx.reply(`Remaining: ${remaining} requests`);

// Reset user
ratelimiter.reset(ctx.sender);

// Get stats
console.log(ratelimiter.getStats());
```

### Permissions

```javascript
const permissions = require('../../lib/permissions');

// Check permission level
const level = await permissions.checkPermission(
  ctx.socket,
  ctx.sender,
  ctx.groupId,
  'GROUP_ADMIN'
);

// Check specific roles
const isAdmin = await permissions.isGroupAdmin(ctx.socket, ctx.sender, ctx.groupId);
const isBotAdmin = await permissions.isBotAdmin(ctx.socket, ctx.groupId);
const isOwner = permissions.isOwner(ctx.sender);

// PERMISSION_LEVELS constant
const { PERMISSION_LEVELS } = require('../../lib/permissions');
// PERMISSION_LEVELS.USER = 0
// PERMISSION_LEVELS.GROUP_ADMIN = 1
// PERMISSION_LEVELS.BOT_ADMIN = 2
// PERMISSION_LEVELS.OWNER = 3
```

---

## 💾 Database Operations

### Get/Set Group Settings

```javascript
const database = require('../../lib/database');

// Get all settings for group
const settings = await database.getGroupSettings(ctx.groupId);

// Update specific setting
await database.updateGroupSetting(ctx.groupId, 'antilink', true);

// Set multiple settings
await database.setGroupSettings(ctx.groupId, {
  antilink: true,
  welcome: true,
  welcomeMessage: 'Welcome!',
});
```

### Warnings System

```javascript
// Add warning
const warningCount = await database.addWarning(ctx.groupId, targetJid);

// Get warnings
const warnings = await database.getWarnings(ctx.groupId, targetJid);

// Reset warnings
await database.resetWarnings(ctx.groupId, targetJid);

// Reset all in group
await database.resetGroupWarnings(ctx.groupId);
```

### Block List

```javascript
// Block user
await database.blockUser(userId);

// Unblock user
await database.unblockUser(userId);

// Check if blocked
const isBlocked = await database.isBlocked(userId);

// Get all blocked
const blocked = await database.getBlockedUsers();
```

### Bot Settings

```javascript
// Get all bot settings
const settings = await database.getBotSettings();

// Set a setting
await database.setBotSetting('key', 'value');
```

---

## 🚀 Advanced Features

### Health Check

```javascript
const healthcheck = require('../../lib/healthcheck');

// Set connection status
healthcheck.setConnected(true);

// Record message
healthcheck.recordMessage();

// Record error
healthcheck.recordError();

// Get status
const status = healthcheck.getStatus();
console.log(status);
// {
//   status: 'healthy',
//   connectionStatus: 'connected',
//   uptime: 3600,
//   messageCount: 150,
//   errorCount: 2,
//   ...
// }

// Get detailed metrics
const metrics = healthcheck.getMetrics();

// Check if healthy
if (healthcheck.isHealthy()) {
  // Bot is working well
}
```

### Backup & Restore

```javascript
const backup = require('../../lib/backup');

// Create manual backup
const file = await backup.backup();

// Restore from backup
const success = await backup.restore('./data/backups/backup-2024.json');

// List all backups
const backups = backup.listBackups();

// Get backup info
const info = backup.getBackupInfo(backupFile);

// Clean old backups (keep last 10)
backup.cleanupOldBackups(10);

// Start auto-backups (every 6 hours)
backup.startAutoBackup(6);
```

### Events & Webhooks

```javascript
const { emitter, BOT_EVENTS } = require('../../lib/events');

// Listen to events
emitter.on(BOT_EVENTS.COMMAND_EXECUTED, (data) => {
  console.log(`Command executed: ${data.command}`);
});

// One-time listener
emitter.once(BOT_EVENTS.BOT_READY, () => {
  console.log('Bot is ready!');
});

// Emit event
await emitter.emit(BOT_EVENTS.COMMAND_EXECUTED, {
  command: 'ping',
  sender: ctx.sender,
});

// Remove listener
emitter.off(BOT_EVENTS.COMMAND_EXECUTED, callback);

// Get listener count
const count = emitter.listenerCount(BOT_EVENTS.COMMAND_EXECUTED);
```

---

## ✅ Best Practices

### 1. Always Validate Input

```javascript
if (!ctx.args.length) {
  await ctx.reply('❌ Please provide required argument');
  return;
}

const number = ctx.args[0];
if (!/^\d+$/.test(number)) {
  await ctx.reply('❌ Invalid format');
  return;
}
```

### 2. Use Try-Catch

```javascript
try {
  // Your logic
} catch (error) {
  logger.error('Command error:', error);
  await ctx.reply('❌ An error occurred');
}
```

### 3. Check Permissions

```javascript
if (command.permission) {
  const level = await permissions.checkPermission(...);
  if (!permissions.hasPermission(level, required)) {
    await ctx.reply('❌ No permission');
    return;
  }
}
```

### 4. Provide User Feedback

```javascript
// Don't just fail silently
if (condition) {
  await ctx.reply('❌ Error: Explain what went wrong');
  return;
}

// Show success
await ctx.reply('✅ Operation successful');

// Show info
await ctx.reply('ℹ️  This is optional info');
```

### 5. Use Descriptive Names

```javascript
// Good
await database.blockUser(userId);

// Bad
await db.add('u', userId);
```

### 6. Cache Expensive Operations

```javascript
const result = await cache.getCached(
  'expensive-op',
  async () => await slowFunction(),
  3600
);
```

---

## 🔗 Integration Examples

### Connect to External API

```javascript
// commands/general/bitcoin.js

const cache = require('../../lib/cache');

module.exports = {
  name: 'bitcoin',
  category: 'general',
  description: 'Get Bitcoin price',
  usage: '.bitcoin',

  async execute(ctx) {
    try {
      const price = await cache.getCached(
        'bitcoin-price',
        async () => {
          // Call API (example)
          // const response = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC');
          // return response.json();
          return { rate: 45000 };
        },
        1800 // Cache for 30 minutes
      );

      await ctx.reply(`💰 Bitcoin: $${price.rate}`);
    } catch (error) {
      await ctx.reply('❌ Failed to fetch price');
    }
  }
};
```

### Send Webhooks on Events

```javascript
const webhook = require('../../lib/webhook');

// Register webhook
webhook.register('command:executed', 'https://api.example.com/webhooks/commands');

// In your handler, trigger webhook
await webhook.trigger('command:executed', {
  command: 'ping',
  sender: ctx.sender,
  timestamp: Date.now(),
});
```

### Multi-step Commands

```javascript
module.exports = {
  name: 'quiz',
  category: 'general',
  description: 'Take a quiz',
  usage: '.quiz',

  async execute(ctx) {
    const questions = [
      { q: 'What is 2+2?', a: '4' },
      { q: 'What is the capital of France?', a: 'Paris' },
    ];

    let score = 0;

    for (const q of questions) {
      await ctx.reply(`❓ ${q.q}`);
      await sleep(2000);
      // In real usage: wait for user response
      // This is simplified
      score++;
    }

    await ctx.reply(`✅ Quiz complete! Score: ${score}/${questions.length}`);
  }
};
```

---

## 📞 Support & Resources

- See `README.md` for full documentation
- Check `FILE_STRUCTURE.md` for file reference
- Look at existing commands for examples
- Use CLI: `node cli.js help`

---

## 🎉 Next Steps

1. Create a custom command
2. Test it locally
3. Add database operations
4. Deploy to production
5. Monitor with health checks

Happy extending! 🚀
