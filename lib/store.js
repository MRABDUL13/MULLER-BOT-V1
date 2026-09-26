const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('./logger');

/**
 * JSON-based store (can be replaced with MongoDB/MySQL)
 * Handles all persistent data for the bot
 */
class JSONStore {
  constructor() {
    this.dbPath = config.DB_PATH;
    this.data = {};
    this.writeQueue = [];
    this.isWriting = false;
  }

  /**
   * Initialize store and load data
   */
  async initialize() {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Load existing data
      if (fs.existsSync(this.dbPath)) {
        const content = fs.readFileSync(this.dbPath, 'utf-8');
        this.data = JSON.parse(content);
        logger.info('Store data loaded');
      } else {
        // Initialize with empty structure
        this.data = {
          groups: {},
          settings: {},
          warnings: {},
          blocks: {},
        };
        await this.save();
      }
    } catch (error) {
      logger.error('Failed to initialize store:', error);
      throw error;
    }
  }

  /**
   * Save data to disk with queue to prevent race conditions
   */
  async save() {
    return new Promise((resolve, reject) => {
      this.writeQueue.push(() => {
        try {
          const content = JSON.stringify(this.data, null, 2);
          fs.writeFileSync(this.dbPath, content, 'utf-8');
          resolve();
        } catch (error) {
          logger.error('Failed to save store:', error);
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  /**
   * Process write queue sequentially
   */
  async processQueue() {
    if (this.isWriting || this.writeQueue.length === 0) {
      return;
    }

    this.isWriting = true;
    const task = this.writeQueue.shift();
    
    try {
      task();
    } finally {
      this.isWriting = false;
      if (this.writeQueue.length > 0) {
        setImmediate(() => this.processQueue());
      }
    }
  }

  /**
   * Get group settings
   */
  getGroupSettings(groupId) {
    if (!this.data.groups) {
      this.data.groups = {};
    }
    return this.data.groups[groupId] || {
      antilink: false,
      welcome: false,
      goodbye: false,
      welcomeMessage: '',
      goodbyeMessage: '',
      muteList: [],
      warnThreshold: 3,
    };
  }

  /**
   * Update group settings
   */
  async setGroupSettings(groupId, settings) {
    if (!this.data.groups) {
      this.data.groups = {};
    }
    this.data.groups[groupId] = {
      ...this.getGroupSettings(groupId),
      ...settings,
    };
    await this.save();
  }

  /**
   * Get warning count for user in group
   */
  getWarnings(groupId, userId) {
    if (!this.data.warnings) {
      this.data.warnings = {};
    }
    if (!this.data.warnings[groupId]) {
      this.data.warnings[groupId] = {};
    }
    return this.data.warnings[groupId][userId] || 0;
  }

  /**
   * Add warning to user
   */
  async addWarning(groupId, userId) {
    if (!this.data.warnings) {
      this.data.warnings = {};
    }
    if (!this.data.warnings[groupId]) {
      this.data.warnings[groupId] = {};
    }
    this.data.warnings[groupId][userId] = (this.data.warnings[groupId][userId] || 0) + 1;
    await this.save();
    return this.data.warnings[groupId][userId];
  }

  /**
   * Reset warnings for user
   */
  async resetWarnings(groupId, userId) {
    if (!this.data.warnings) {
      this.data.warnings = {};
    }
    if (!this.data.warnings[groupId]) {
      this.data.warnings[groupId] = {};
    }
    this.data.warnings[groupId][userId] = 0;
    await this.save();
  }

  /**
   * Check if user is blocked
   */
  isBlocked(userId) {
    if (!this.data.blocks) {
      this.data.blocks = {};
    }
    return this.data.blocks[userId] === true;
  }

  /**
   * Block user
   */
  async blockUser(userId) {
    if (!this.data.blocks) {
      this.data.blocks = {};
    }
    this.data.blocks[userId] = true;
    await this.save();
  }

  /**
   * Unblock user
   */
  async unblockUser(userId) {
    if (!this.data.blocks) {
      this.data.blocks = {};
    }
    delete this.data.blocks[userId];
    await this.save();
  }

  /**
   * Get all blocked users
   */
  getBlockedUsers() {
    if (!this.data.blocks) {
      return [];
    }
    return Object.keys(this.data.blocks).filter(k => this.data.blocks[k] === true);
  }

  /**
   * Get bot settings
   */
  getBotSettings() {
    if (!this.data.settings) {
      this.data.settings = {};
    }
    return this.data.settings;
  }

  /**
   * Update bot settings
   */
  async setBotSetting(key, value) {
    if (!this.data.settings) {
      this.data.settings = {};
    }
    this.data.settings[key] = value;
    await this.save();
  }

  /**
   * Close store connection
   */
  async close() {
    // Wait for any pending writes
    while (this.writeQueue.length > 0 || this.isWriting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

// Initialize store
const store = new JSONStore();

module.exports = store;
