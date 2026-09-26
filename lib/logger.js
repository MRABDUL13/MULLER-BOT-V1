const pino = require('pino');
const config = require('../config/config');

// Create logger with appropriate settings
const logger = pino({
  level: config.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: false,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      messageFormat: '{levelLabel} {msg}',
    },
  },
});

/**
 * Safe logging utilities that never expose secrets
 */
module.exports = {
  info: (message, data) => {
    if (data && typeof data === 'object') {
      logger.info(data, message);
    } else {
      logger.info(message);
    }
  },

  warn: (message, data) => {
    if (data && typeof data === 'object') {
      logger.warn(data, message);
    } else {
      logger.warn(message);
    }
  },

  error: (message, error) => {
    if (error instanceof Error) {
      logger.error({
        stack: error.stack,
        message: error.message,
      }, message);
    } else if (typeof error === 'object') {
      logger.error(error, message);
    } else {
      logger.error(message);
    }
  },

  debug: (message, data) => {
    if (data && typeof data === 'object') {
      logger.debug(data, message);
    } else {
      logger.debug(message);
    }
  },

  /**
   * Log command execution (safe version - no credentials)
   */
  logCommand: (command, sender, group = null) => {
    const groupName = group ? ` in ${group}` : '';
    logger.info(`Command: ${command} | User: ${sender}${groupName}`);
  },

  /**
   * Log permission denial (safe version)
   */
  logPermissionDenied: (command, sender, reason) => {
    logger.warn(`Permission denied for ${command} | User: ${sender} | Reason: ${reason}`);
  },

  /**
   * Log errors without exposing sensitive info
   */
  logCommandError: (command, error) => {
    if (error instanceof Error) {
      logger.error({
        command,
        error: error.message,
        stack: process.env.LOG_LEVEL === 'debug' ? error.stack : undefined,
      }, 'Command execution failed');
    }
  },
};
