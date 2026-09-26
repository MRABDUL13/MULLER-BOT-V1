/**
 * Rate limiter to prevent abuse
 */
class RateLimiter {
  constructor(windowMs = 60000, maxRequests = 30) {
    this.windowMs = windowMs; // Time window in ms
    this.maxRequests = maxRequests; // Max requests per window
    this.requests = new Map(); // Store: userId -> [timestamps]
  }

  /**
   * Check if user is rate limited
   */
  isLimited(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];

    // Remove old requests outside window
    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );

    // Check if exceeded limit
    if (recentRequests.length >= this.maxRequests) {
      return true;
    }

    // Record this request
    recentRequests.push(now);
    this.requests.set(userId, recentRequests);

    // Cleanup old entries
    if (this.requests.size > 10000) {
      this.cleanup();
    }

    return false;
  }

  /**
   * Get remaining requests for user
   */
  getRemaining(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];

    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );

    return Math.max(0, this.maxRequests - recentRequests.length);
  }

  /**
   * Reset rate limit for user
   */
  reset(userId) {
    this.requests.delete(userId);
  }

  /**
   * Cleanup old entries
   */
  cleanup() {
    const now = Date.now();
    for (const [userId, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(
        timestamp => now - timestamp < this.windowMs * 2
      );

      if (recentRequests.length === 0) {
        this.requests.delete(userId);
      } else {
        this.requests.set(userId, recentRequests);
      }
    }
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      windowMs: this.windowMs,
      maxRequests: this.maxRequests,
      trackedUsers: this.requests.size,
    };
  }
}

// Export singleton with default settings
module.exports = new RateLimiter(60000, 30);
