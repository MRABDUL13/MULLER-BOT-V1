# MULLER BOT - API Reference

Complete API documentation for all modules and functions.

---

## 📦 Core Modules

### config/config.js

Configuration loader with environment variables.

```javascript
const config = require('./config/config');

// Properties
config.BOT_NAME              // Bot name
config.OWNER_NUMBER          // Owner's WhatsApp number
config.PREFIX                // Command prefix
config.MODE                  // public or private
config.AUTH_METHOD           // pairing or qr
config.PHONE_NUMBER          // Bot's WhatsApp number
config.SESSION_DIR           // Session storage path
config.DATA_DIR              // Data storage path
config.LOG_LEVEL             // Log level
```

---

## 📚 Library Modules

### lib/logger.js

Logging utilities with Pino.

```javascript
const logger = require('./lib/logger');

logger.info(message, data?)         // Info log
logger.warn(message, data?)         // Warning log
logger.error(message, error?)       // Error log
logger.debug(message, data?)        // Debug log
logger.logCommand(cmd, sender, group?)
logger.logPermissionDenied(cmd, sender, reason)
logger.logCommandError(cmd, error)
```

### lib/permissions.js

Permission system for commands.

```javascript
const permissions = require('./lib/permissions');

// Constants
permissions.PERMISSION_LEVELS.USER
permissions.PERMISSION_LEVELS.GROUP_ADMIN
permissions.PERMISSION_LEVELS.BOT_ADMIN
permissions.PERMISSION_LEVELS.OWNER

// Methods
await permissions.checkPermission(socket, sender, groupId, level)
permissions.hasPermission(userLevel, requiredLevel)
await permissions.isGroupAdmin(socket, sender, groupId)
await permissions.isBotAdmin(socket, groupId)
permissions.isOwner(sender)
```

### lib/utils.js

Utility functions (40+ available).

```javascript
const utils = require('./lib/utils');

// Time functions
utils.formatTime(seconds)       // "1h 23m 45s"
utils.getUptime()               // Seconds since bot started
utils.formatMs(ms)              // "1.5s" or "100ms"

// Message parsing
utils.parseCommand(text, prefix)
utils.generateMentions(numbers)
utils.escapeMessage(text)
utils.boxMessage(title, ...lines)

// Phone numbers
utils.isValidPhoneNumber(number)
utils.normalizePhoneNumber(number)

// Detection
utils.isFromGroup(chatId)
utils.getGroupId(chatId)
utils.isUrl(text)
utils.isWhatsAppInviteLink(text)

// Files
utils.createSafeFilename(text)
utils.deleteFile(path)
utils.formatFileSize(bytes)

// Other
utils.sleep(ms)
```

### lib/database.js

Database abstraction layer.

```javascript
const database = require('./lib/database');

// Group settings
await database.getGroupSettings(groupId)
await database.setGroupSettings(groupId, settings)
await database.updateGroupSetting(groupId, key, value)

// Warnings
await database.getWarnings(groupId, userId)
await database.addWarning(groupId, userId)
await database.resetWarnings(groupId, userId)
await database.resetGroupWarnings(groupId)

// Block list
await database.blockUser(userId)
await database.unblockUser(userId)
await database.isBlocked(userId)
await database.getBlockedUsers()

// Bot settings
await database.getBotSettings()
await database.setBotSetting(key, value)

// Connection
await database.initialize()
await database.close()
```

### lib/cache.js

In-memory cache with TTL support.

```javascript
const cache = require('./lib/cache');

cache.set(key, value, ttlSeconds?)
cache.get(key)
cache.has(key)
cache.delete(key)
cache.clear()

cache.size()                        // Number of entries
cache.getStats()                    // { size, withTTL }

await cache.getCached(key, fn, ttlSeconds?)
```

### lib/ratelimiter.js

Rate limiting for abuse prevention.

```javascript
const ratelimiter = require('./lib/ratelimiter');

ratelimiter.isLimited(userId)       // True if rate limited
ratelimiter.getRemaining(userId)    // Requests remaining
ratelimiter.reset(userId)           // Reset for user
ratelimiter.getStats()              // Stats
```

### lib/healthcheck.js

Bot health monitoring.

```javascript
const healthcheck = require('./lib/healthcheck');

healthcheck.setConnected(boolean)
healthcheck.recordMessage()
healthcheck.recordError()

healthcheck.getStatus()              // Current status
healthcheck.getMetrics()             // Detailed metrics
healthcheck.isHealthy()              // Boolean
healthcheck.reset()                  // Reset stats
healthcheck.logStatus()              // Log to console
```

### lib/backup.js

Database backup and restore.

```javascript
const backup = require('./lib/backup');

await backup.backup()                       // Create backup
await backup.restore(filePath)              // Restore backup
backup.listBackups()                        // List all
backup.getBackupInfo(filePath)              // Backup details
backup.cleanupOldBackups(keepCount)         // Clean old
backup.startAutoBackup(intervalHours)       // Schedule
```

### lib/events.js

Event emitter for bot events.

```javascript
const { emitter, BOT_EVENTS } = require('./lib/events');

// Events available
BOT_EVENTS.CONNECTED
BOT_EVENTS.DISCONNECTED
BOT_EVENTS.MESSAGE_RECEIVED
BOT_EVENTS.MESSAGE_SENT
BOT_EVENTS.COMMAND_EXECUTED
BOT_EVENTS.COMMAND_FAILED
BOT_EVENTS.BOT_READY

// Methods
emitter.on(eventName, callback)
emitter.once(eventName, callback)
emitter.off(eventName, callback)
await emitter.emit(eventName, ...args)
emitter.removeAllListeners(eventName?)
emitter.listenerCount(eventName)
emitter.eventNames()
```

### lib/webhook.js

Webhook system for integrations.

```javascript
const webhook = require('./lib/webhook');

webhook.register(eventName, url)
webhook.unregister(eventName, url)
await webhook.trigger(eventName, data)
webhook.listWebhooks(eventName?)
webhook.clear(eventName?)
webhook.count()
```

### lib/dashboard.js

Optional web dashboard (requires setup).

```javascript
const dashboard = require('./lib/dashboard');

dashboard.start(port, metricsProvider)
dashboard.stop()
```

---

## 🎮 Handler Modules

### handler/connection.js

WhatsApp connection management.

```javascript
const { startConnection } = require('./handler/connection');

const sock = await startConnection();
// Returns Baileys socket instance
```

### handler/commands.js

Command loading system.

```javascript
const {
  loadCommands,
  getCommand,
  getCommandsByCategory,
} = require('./handler/commands');

const commands = await loadCommands()    // Map of all commands
getCommand(commands, name)               // Get specific command
getCommandsByCategory(commands, cat)    // Commands in category
```

### handler/events.js

Event listener setup.

```javascript
const { setupEventHandlers } = require('./handler/events');

setupEventHandlers(socket, commands);
// Sets up all Baileys event listeners
```

---

## 🖱️ Command Structure

Every command module must export:

```javascript
module.exports = {
  name: 'commandname',              // Command name (required)
  aliases: ['alias1', 'alias2'],   // Alternative names (optional)
  category: 'general',               // Category (required)
  description: 'What it does',      // Description (required)
  usage: '.command [args]',         // Usage example (required)
  
  permission: 'USER',               // Permission level (optional)
  groupOnly: false,                 // Group only (optional)
  privateOnly: false,               // Private only (optional)
  
  help: 'Detailed help text...',   // Help text (optional)

  async execute(ctx) {
    // ctx object contains:
    // - sender, senderName
    // - jid, groupId
    // - messageText, messageType
    // - isGroup, isReply
    // - message, key, quotedMessage, groupMetadata
    // - args
    // - socket, reply(), sendMessage(), replyWithMention()
    
    await ctx.reply('Response');
  }
};
```

---

## 📡 API Endpoints (Web Dashboard)

If dashboard is enabled:

```
GET  /                    # Dashboard UI
GET  /api/health          # Health check
GET  /api/status          # Status endpoint
GET  /api/metrics         # Detailed metrics
GET  /api/about           # API information
```

---

## 🔌 Baileys Socket Methods

Available via `ctx.socket`:

```javascript
// Messages
await socket.sendMessage(chatId, message, options?)
await socket.downloadMediaMessage(message)

// Groups
await socket.groupMetadata(groupId)
await socket.groupParticipantsUpdate(groupId, jids, action)
await socket.groupMakeAdmin(groupId, jids)
await socket.groupDemoteAdmin(groupId, jids)

// Status
socket.user                           // Bot's user info
socket.ev.on('messages.upsert', ...)
socket.ev.on('connection.update', ...)
```

---

## 📊 Data Structures

### Message Context (ctx)

```javascript
{
  socket: BaileysSocket,
  message: Message,
  key: MessageKey,
  sender: string,                  // User JID
  senderName: string,
  jid: string,                     // Chat JID
  groupId: string | null,
  groupName: string,
  messageText: string,
  messageType: string,             // text, image, video, etc
  isGroup: boolean,
  isReply: boolean,
  quotedMessage: Message | null,
  groupMetadata: GroupMetadata | null,
  timestamp: number,
  args: string[],
  reply: async (text) => Promise,
  replyWithMention: async (text, mentions) => Promise,
  sendMessage: async (text, quoted) => Promise,
}
```

### Group Settings

```javascript
{
  antilink: boolean,
  welcome: boolean,
  goodbye: boolean,
  welcomeMessage: string,
  goodbyeMessage: string,
  muteList: string[],              // User JIDs
  warnThreshold: number,            // Max warnings
}
```

### Bot Metrics

```javascript
{
  status: string,                   // healthy | unhealthy
  connectionStatus: string,         // connected | disconnected
  uptime: number,                   // Seconds
  messageCount: number,
  errorCount: number,
  errorRate: string,                // "2.5%"
  messagesPerMinute: string,
  timestamp: string,
  memory: {
    heapUsed: string,
    heapTotal: string,
    external: string,
    rss: string,
  },
  cpu: {
    uptime: number,
  }
}
```

---

## ⚠️ Error Handling

All methods return promises. Always use try-catch:

```javascript
try {
  await database.blockUser(userId);
} catch (error) {
  logger.error('Failed to block:', error);
  await ctx.reply('❌ Failed to block user');
}
```

---

## 🔐 Security Notes

- Never log sensitive data
- Validate all user input
- Check permissions before operations
- Use rate limiting for expensive ops
- Keep .env secrets safe
- Hash passwords if needed
- Escape user-provided text

---

See [EXTENDING.md](EXTENDING.md) for usage examples and best practices.

Made with ❤️ for Mullerdata
