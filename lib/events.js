const logger = require('./logger');

/**
 * Bot event emitter for plugins and integrations
 * Allows external systems to listen to bot events
 */
class BotEventEmitter {
  constructor() {
    this.events = new Map();
    this.maxListeners = 10;
  }

  /**
   * Register event listener
   */
  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const listeners = this.events.get(eventName);
    listeners.push(callback);

    logger.debug(`Event listener registered: ${eventName} (${listeners.length} total)`);

    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
        logger.debug(`Event listener removed: ${eventName}`);
      }
    };
  }

  /**
   * Register one-time listener
   */
  once(eventName, callback) {
    const unsubscribe = this.on(eventName, async (...args) => {
      unsubscribe();
      await callback(...args);
    });
    return unsubscribe;
  }

  /**
   * Emit event
   */
  async emit(eventName, ...args) {
    if (!this.events.has(eventName)) {
      return;
    }

    const listeners = this.events.get(eventName);
    
    for (const callback of listeners) {
      try {
        await callback(...args);
      } catch (error) {
        logger.error(`Error in event listener for ${eventName}:`, error);
      }
    }
  }

  /**
   * Remove specific listener
   */
  off(eventName, callback) {
    if (!this.events.has(eventName)) {
      return;
    }

    const listeners = this.events.get(eventName);
    const index = listeners.indexOf(callback);

    if (index > -1) {
      listeners.splice(index, 1);
      logger.debug(`Event listener removed: ${eventName}`);
    }
  }

  /**
   * Remove all listeners for event
   */
  removeAllListeners(eventName) {
    if (eventName) {
      this.events.delete(eventName);
      logger.debug(`All listeners removed for: ${eventName}`);
    } else {
      this.events.clear();
      logger.debug('All event listeners cleared');
    }
  }

  /**
   * Get listener count for event
   */
  listenerCount(eventName) {
    return (this.events.get(eventName) || []).length;
  }

  /**
   * Get all event names
   */
  eventNames() {
    return Array.from(this.events.keys());
  }
}

// Predefined events
const BOT_EVENTS = {
  // Connection events
  CONNECTED: 'bot:connected',
  DISCONNECTED: 'bot:disconnected',

  // Message events
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_SENT: 'message:sent',
  MESSAGE_ERROR: 'message:error',

  // Command events
  COMMAND_EXECUTED: 'command:executed',
  COMMAND_FAILED: 'command:failed',
  COMMAND_PERMISSION_DENIED: 'command:permission-denied',

  // Group events
  GROUP_JOIN: 'group:join',
  GROUP_LEAVE: 'group:leave',
  MEMBER_JOIN: 'member:join',
  MEMBER_LEAVE: 'member:leave',

  // Bot events
  BOT_READY: 'bot:ready',
  BOT_ERROR: 'bot:error',
  BOT_SHUTDOWN: 'bot:shutdown',
};

// Export singleton and events
module.exports = {
  emitter: new BotEventEmitter(),
  BOT_EVENTS,
};
