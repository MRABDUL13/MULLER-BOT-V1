const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('./logger');

/**
 * Database backup and restore utilities
 */
class BackupManager {
  constructor() {
    this.backupDir = path.join(config.DATA_DIR, 'backups');
    this.ensureBackupDir();
  }

  /**
   * Ensure backup directory exists
   */
  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      logger.info(`📁 Backup directory created: ${this.backupDir}`);
    }
  }

  /**
   * Create backup of database
   */
  async backup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, `backup-${timestamp}.json`);

      // Read current database
      const dbPath = config.DB_PATH;
      if (!fs.existsSync(dbPath)) {
        logger.warn('Database file not found for backup');
        return null;
      }

      // Copy to backup location
      const content = fs.readFileSync(dbPath, 'utf-8');
      fs.writeFileSync(backupFile, content, 'utf-8');

      logger.info(`✅ Database backed up: ${backupFile}`);
      return backupFile;
    } catch (error) {
      logger.error('Backup failed:', error);
      return null;
    }
  }

  /**
   * Restore from backup
   */
  async restore(backupFile) {
    try {
      if (!fs.existsSync(backupFile)) {
        logger.error(`Backup file not found: ${backupFile}`);
        return false;
      }

      // Create backup of current before restore
      const dbPath = config.DB_PATH;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safetyBackup = path.join(this.backupDir, `pre-restore-${timestamp}.json`);

      if (fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, safetyBackup);
        logger.info(`📁 Safety backup created: ${safetyBackup}`);
      }

      // Restore from backup
      const content = fs.readFileSync(backupFile, 'utf-8');
      fs.writeFileSync(dbPath, content, 'utf-8');

      logger.info(`✅ Database restored from: ${backupFile}`);
      return true;
    } catch (error) {
      logger.error('Restore failed:', error);
      return false;
    }
  }

  /**
   * List all backups
   */
  listBackups() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
        .sort()
        .reverse();

      return files.map(f => ({
        name: f,
        path: path.join(this.backupDir, f),
        timestamp: f.replace('backup-', '').replace('.json', ''),
      }));
    } catch (error) {
      logger.error('Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Delete old backups (keep last N)
   */
  cleanupOldBackups(keepCount = 10) {
    try {
      const backups = this.listBackups();

      if (backups.length > keepCount) {
        const toDelete = backups.slice(keepCount);
        
        for (const backup of toDelete) {
          fs.unlinkSync(backup.path);
          logger.info(`🗑️  Deleted old backup: ${backup.name}`);
        }

        return toDelete.length;
      }

      return 0;
    } catch (error) {
      logger.error('Cleanup failed:', error);
      return 0;
    }
  }

  /**
   * Get backup info
   */
  getBackupInfo(backupFile) {
    try {
      const stats = fs.statSync(backupFile);
      const content = fs.readFileSync(backupFile, 'utf-8');
      const data = JSON.parse(content);

      return {
        file: path.basename(backupFile),
        size: `${(stats.size / 1024).toFixed(2)} KB`,
        created: stats.mtime.toISOString(),
        groups: Object.keys(data.groups || {}).length,
        warnings: Object.keys(data.warnings || {}).length,
        blocked: Object.keys(data.blocks || {}).length,
      };
    } catch (error) {
      logger.error('Failed to get backup info:', error);
      return null;
    }
  }

  /**
   * Automatic daily backup
   */
  startAutoBackup(intervalHours = 24) {
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    setInterval(async () => {
      logger.info('🔄 Running scheduled backup...');
      await this.backup();
      this.cleanupOldBackups(10);
    }, intervalMs);

    logger.info(`⏰ Auto-backup scheduled every ${intervalHours} hours`);
  }
}

module.exports = new BackupManager();
