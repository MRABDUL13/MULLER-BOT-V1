const logger = require('./logger');

/**
 * In-memory cache with TTL support
 * Used for caching frequently accessed data
 */
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttls = new Map();
  }

  /**
   * Set cache value with optional TTL
   */
  set(key, value, ttlSeconds = null) {
    this.cache.set(key, value);

    if (ttlSeconds) {
      // Clear existing timeout if any
      if (this.ttls.has(key)) {
        clearTimeout(this.ttls.get(key).timeout);
      }

      // Set new timeout
      const timeout = setTimeout(() => {
        this.delete(key);
        logger.debug(`Cache expired: ${key}`);
      }, ttlSeconds * 1000);

      this.ttls.set(key, { timeout, expires: Date.now() + (ttlSeconds * 1000) });
    }

    logger.debug(`Cache set: ${key}`);
  }

  /**
   * Get cache value
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Check if key exists and not expired
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Delete cache entry
   */
  delete(key) {
    if (this.ttls.has(key)) {
      clearTimeout(this.ttls.get(key).timeout);
      this.ttls.delete(key);
    }
    this.cache.delete(key);
    logger.debug(`Cache deleted: ${key}`);
  }

  /**
   * Clear all cache
   */
  clear() {
    for (const [key, ttl] of this.ttls) {
      clearTimeout(ttl.timeout);
    }
    this.cache.clear();
    this.ttls.clear();
    logger.info('Cache cleared');
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }

  /**
   * Get all cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      withTTL: this.ttls.size,
    };
  }

  /**
   * Cache a function result
   */
  async getCached(key, fn, ttlSeconds = 300) {
    // Check if already cached
    if (this.has(key)) {
      logger.debug(`Cache hit: ${key}`);
      return this.get(key);
    }

    // Call function and cache result
    logger.debug(`Cache miss: ${key}`);
    const result = await fn();
    this.set(key, result, ttlSeconds);
    return result;
  }
}

// Export singleton instance
module.exports = new CacheManager();
