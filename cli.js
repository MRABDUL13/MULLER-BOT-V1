#!/usr/bin/env node

/**
 * MULLER BOT CLI - Command Line Interface for Bot Management
 * Usage: node cli.js [command] [options]
 * 
 * Commands:
 *   backup              Create database backup
 *   restore <file>      Restore from backup
 *   list-backups        List all backups
 *   clear-sessions      Clear authentication sessions
 *   reset-warnings      Reset all warnings
 *   list-blocked        List blocked users
 *   block <number>      Block a user
 *   unblock <number>    Unblock a user
 *   migrate             Migrate database (placeholder)
 *   config              Show current configuration
 *   help                Show this help message
 */

const fs = require('fs');
const path = require('path');
const config = require('./config/config');
const database = require('./lib/database');
const backup = require('./lib/backup');
const logger = require('./lib/logger');

const args = process.argv.slice(2);
const command = args[0];
const options = args.slice(1);

async function run() {
  try {
    // Initialize database
    await database.initialize();

    switch (command) {
      case 'backup':
        await cmdBackup();
        break;

      case 'restore':
        await cmdRestore(options[0]);
        break;

      case 'list-backups':
        await cmdListBackups();
        break;

      case 'clear-sessions':
        await cmdClearSessions();
        break;

      case 'reset-warnings':
        await cmdResetWarnings();
        break;

      case 'list-blocked':
        await cmdListBlocked();
        break;

      case 'block':
        await cmdBlock(options[0]);
        break;

      case 'unblock':
        await cmdUnblock(options[0]);
        break;

      case 'config':
        await cmdConfig();
        break;

      case 'help':
      case '--help':
      case '-h':
      case undefined:
        showHelp();
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    logger.error('CLI Error:', error);
    process.exit(1);
  }
}

/**
 * Create backup
 */
async function cmdBackup() {
  console.log('💾 Creating backup...');
  const backupFile = await backup.backup();
  if (backupFile) {
    console.log(`✅ Backup created: ${backupFile}`);
  } else {
    console.error('❌ Backup failed');
  }
}

/**
 * Restore from backup
 */
async function cmdRestore(backupFile) {
  if (!backupFile) {
    console.error('❌ Please specify backup file');
    process.exit(1);
  }

  console.log(`📂 Restoring from: ${backupFile}`);
  const success = await backup.restore(backupFile);
  if (success) {
    console.log('✅ Database restored successfully');
  } else {
    console.error('❌ Restore failed');
  }
}

/**
 * List backups
 */
async function cmdListBackups() {
  const backups = backup.listBackups();
  
  if (backups.length === 0) {
    console.log('ℹ️  No backups found');
    return;
  }

  console.log('📋 Available Backups:\n');
  backups.forEach((b, i) => {
    const info = backup.getBackupInfo(b.path);
    if (info) {
      console.log(`${i + 1}. ${b.name}`);
      console.log(`   Size: ${info.size}`);
      console.log(`   Created: ${info.created}`);
      console.log(`   Groups: ${info.groups}, Warnings: ${info.warnings}, Blocked: ${info.blocked}\n`);
    }
  });
}

/**
 * Clear sessions
 */
async function cmdClearSessions() {
  const sessionDir = config.SESSION_DIR;
  
  if (!fs.existsSync(sessionDir)) {
    console.log('ℹ️  No sessions found');
    return;
  }

  console.log('⚠️  Clearing sessions...');
  fs.rmSync(sessionDir, { recursive: true, force: true });
  fs.mkdirSync(sessionDir, { recursive: true });
  console.log('✅ Sessions cleared. You will need to re-authenticate when bot starts.');
}

/**
 * Reset all warnings
 */
async function cmdResetWarnings() {
  console.log('⚠️  Resetting all warnings...');
  
  if (database.store && database.store.data) {
    database.store.data.warnings = {};
    await database.store.save();
    console.log('✅ All warnings cleared');
  } else {
    console.error('❌ Failed to reset warnings');
  }
}

/**
 * List blocked users
 */
async function cmdListBlocked() {
  const blocked = await database.getBlockedUsers();
  
  if (blocked.length === 0) {
    console.log('ℹ️  No blocked users');
    return;
  }

  console.log('🚫 Blocked Users:\n');
  blocked.forEach((user, i) => {
    console.log(`${i + 1}. ${user}`);
  });
}

/**
 * Block user
 */
async function cmdBlock(number) {
  if (!number) {
    console.error('❌ Please provide a phone number');
    process.exit(1);
  }

  const jid = `${number}@s.whatsapp.net`;
  await database.blockUser(jid);
  console.log(`✅ Blocked: ${number}`);
}

/**
 * Unblock user
 */
async function cmdUnblock(number) {
  if (!number) {
    console.error('❌ Please provide a phone number');
    process.exit(1);
  }

  const jid = `${number}@s.whatsapp.net`;
  await database.unblockUser(jid);
  console.log(`✅ Unblocked: ${number}`);
}

/**
 * Show configuration
 */
async function cmdConfig() {
  console.log('⚙️  Current Configuration:\n');
  console.log(`BOT_NAME: ${config.BOT_NAME}`);
  console.log(`OWNER_NUMBER: ${config.OWNER_NUMBER}`);
  console.log(`PREFIX: ${config.PREFIX}`);
  console.log(`MODE: ${config.MODE}`);
  console.log(`AUTH_METHOD: ${config.AUTH_METHOD}`);
  console.log(`SESSION_DIR: ${config.SESSION_DIR}`);
  console.log(`DATA_DIR: ${config.DATA_DIR}`);
  console.log(`DB_TYPE: ${config.DB_TYPE}`);
  console.log(`LOG_LEVEL: ${config.LOG_LEVEL}`);
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  MULLER BOT CLI v1.0   ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

Usage: node cli.js [command] [options]

Commands:

  backup                  Create database backup
  restore <file>          Restore from backup file
  list-backups            List all available backups
  clear-sessions          Clear WhatsApp sessions (re-auth required)
  reset-warnings          Reset all user warnings
  list-blocked            List all blocked users
  block <number>          Block a user by phone number
  unblock <number>        Unblock a user
  config                  Show current configuration
  help                    Show this help message

Examples:

  node cli.js backup
  node cli.js restore backup-2024-01-15.json
  node cli.js list-backups
  node cli.js block 234XXXXXXXXXX
  node cli.js config

Notes:

  - Always backup before making changes
  - Block/unblock numbers without +234 prefix
  - Use clear-sessions only if you need to re-authenticate
  - Config shows all environment settings

Made with ❤️ for Mullerdata
`);
}

// Run CLI
run();
