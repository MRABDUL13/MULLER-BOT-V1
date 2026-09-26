const logger = require('./logger');

/**
 * Webhook system for integrations
 * Send bot events to external services via HTTP
 */
class WebhookManager {
  constructor() {
    this.webhooks = new Map(); // eventName -> [urls]
    this.timeout = 5000; // 5 second timeout
  }

  /**
   * Register webhook for event
   */
  register(eventName, webhookUrl) {
    if (!this.webhooks.has(eventName)) {
      this.webhooks.set(eventName, []);
    }

    const urls = this.webhooks.get(eventName);
    
    if (!urls.includes(webhookUrl)) {
      urls.push(webhookUrl);
      logger.info(`✅ Webhook registered: ${eventName} → ${webhookUrl}`);
    }
  }

  /**
   * Unregister webhook
   */
  unregister(eventName, webhookUrl) {
    if (!this.webhooks.has(eventName)) {
      return;
    }

    const urls = this.webhooks.get(eventName);
    const index = urls.indexOf(webhookUrl);

    if (index > -1) {
      urls.splice(index, 1);
      logger.info(`✅ Webhook unregistered: ${eventName}`);
    }
  }

  /**
   * Trigger webhook
   */
  async trigger(eventName, data) {
    if (!this.webhooks.has(eventName)) {
      return;
    }

    const urls = this.webhooks.get(eventName);
    
    for (const url of urls) {
      this.sendWebhook(url, eventName, data).catch(error => {
        logger.error(`Webhook failed for ${eventName}:`, error);
      });
    }
  }

  /**
   * Send webhook request
   */
  async sendWebhook(url, eventName, data) {
    try {
      const payload = {
        event: eventName,
        timestamp: new Date().toISOString(),
        data,
      };

      // Note: Requires https module (built-in)
      // For actual implementation, use fetch or axios
      // This is a placeholder showing the structure
      
      logger.debug(`📤 Webhook: ${eventName} → ${url}`);
      
      // Example using fetch (if available in newer Node.js)
      // const response = await fetch(url, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      //   timeout: this.timeout,
      // });

      return { success: true, url, eventName };
    } catch (error) {
      logger.error(`Webhook error for ${eventName}:`, error);
      throw error;
    }
  }

  /**
   * List all webhooks
   */
  listWebhooks(eventName = null) {
    if (eventName) {
      return this.webhooks.get(eventName) || [];
    }

    const all = {};
    for (const [event, urls] of this.webhooks) {
      all[event] = urls;
    }
    return all;
  }

  /**
   * Clear webhooks
   */
  clear(eventName = null) {
    if (eventName) {
      this.webhooks.delete(eventName);
      logger.info(`Webhooks cleared for: ${eventName}`);
    } else {
      this.webhooks.clear();
      logger.info('All webhooks cleared');
    }
  }

  /**
   * Get webhook count
   */
  count() {
    let total = 0;
    for (const urls of this.webhooks.values()) {
      total += urls.length;
    }
    return total;
  }
}

// Export singleton
module.exports = new WebhookManager();
