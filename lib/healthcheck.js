const config = require('../config/config');
const logger = require('./logger');

/**
 * Health check system for monitoring bot status
 */
class HealthCheck {
  constructor() {
    this.startTime = Date.now();
    this.messageCount = 0;
    this.errorCount = 0;
    this.lastCheckTime = Date.now();
    this.connectionStatus = 'disconnected';
  }

  /**
   * Record bot connection status
   */
  setConnected(isConnected) {
    this.connectionStatus = isConnected ? 'connected' : 'disconnected';
    if (isConnected) {
      logger.info('✅ Bot connection status: CONNECTED');
    } else {
      logger.warn('⚠️  Bot connection status: DISCONNECTED');
    }
  }

  /**
   * Record incoming message
   */
  recordMessage() {
    this.messageCount++;
  }

  /**
   * Record error
   */
  recordError() {
    this.errorCount++;
  }

  /**
   * Get current health status
   */
  getStatus() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const avgMessagesPerMinute = this.messageCount / (uptime / 60);
    const errorRate = this.messageCount > 0 ? (this.errorCount / this.messageCount * 100).toFixed(2) : 0;

    return {
      status: this.connectionStatus === 'connected' ? 'healthy' : 'unhealthy',
      connectionStatus: this.connectionStatus,
      uptime: uptime,
      messageCount: this.messageCount,
      errorCount: this.errorCount,
      errorRate: `${errorRate}%`,
      messagesPerMinute: avgMessagesPerMinute.toFixed(2),
      timestamp: new Date().toISOString(),
      botName: config.BOT_NAME,
      mode: config.MODE,
    };
  }

  /**
   * Get detailed metrics
   */
  getMetrics() {
    const status = this.getStatus();
    const memoryUsage = process.memoryUsage();

    return {
      ...status,
      memory: {
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      },
      cpu: {
        uptime: Math.floor(process.uptime()),
      },
    };
  }

  /**
   * Check if bot is healthy
   */
  isHealthy() {
    return this.connectionStatus === 'connected' && this.errorCount < 10;
  }

  /**
   * Reset stats
   */
  reset() {
    this.messageCount = 0;
    this.errorCount = 0;
    this.startTime = Date.now();
    logger.info('📊 Health check stats reset');
  }

  /**
   * Log current status
   */
  logStatus() {
    const status = this.getStatus();
    logger.info('📊 Health Status:', status);
  }
}

// Export singleton instance
module.exports = new HealthCheck();
