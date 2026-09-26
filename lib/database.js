/**
 * Database abstraction layer
 * Currently uses JSON store, but designed to be easily replaced with MongoDB/MySQL
 */

const config = require('../config/config');
const store = require('./store');

class Database {
  async initialize() {
    await store.initialize();
  }

  // Group settings
  async getGroupSettings(groupId) {
    return store.getGroupSettings(groupId);
  }

  async setGroupSettings(groupId, settings) {
    return store.setGroupSettings(groupId, settings);
  }

  async updateGroupSetting(groupId, key, value) {
    const settings = store.getGroupSettings(groupId);
    settings[key] = value;
    return store.setGroupSettings(groupId, settings);
  }

  // Warnings
  async getWarnings(groupId, userId) {
    return store.getWarnings(groupId, userId);
  }

  async addWarning(groupId, userId) {
    return store.addWarning(groupId, userId);
  }

  async resetWarnings(groupId, userId) {
    return store.resetWarnings(groupId, userId);
  }

  async resetGroupWarnings(groupId) {
    if (!store.data.warnings) {
      store.data.warnings = {};
    }
    store.data.warnings[groupId] = {};
    await store.save();
  }

  // Block list
  async blockUser(userId) {
    return store.blockUser(userId);
  }

  async unblockUser(userId) {
    return store.unblockUser(userId);
  }

  async isBlocked(userId) {
    return store.isBlocked(userId);
  }

  async getBlockedUsers() {
    return store.getBlockedUsers();
  }

  // Bot settings
  async getBotSettings() {
    return store.getBotSettings();
  }

  async setBotSetting(key, value) {
    return store.setBotSetting(key, value);
  }

  async close() {
    return store.close();
  }
}

module.exports = new Database();
