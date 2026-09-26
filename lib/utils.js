const fs = require('fs');
const path = require('path');

/**
 * Format time in HH:MM:SS format
 */
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Calculate bot uptime
 */
function getUptime() {
  const seconds = Math.floor(process.uptime());
  return formatTime(seconds);
}

/**
 * Format milliseconds to readable time
 */
function formatMs(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

/**
 * Extract command and args from message
 */
function parseCommand(text, prefix) {
  if (!text || typeof text !== 'string') return null;
  if (!text.startsWith(prefix)) return null;
  
  const content = text.slice(prefix.length).trim();
  if (!content) return null;

  const parts = content.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  return { command, args, fullText: content };
}

/**
 * Generate WhatsApp mentions format
 */
function generateMentions(phoneNumbers) {
  return phoneNumbers.map(num => `@${num.replace(/[^\d]/g, '')}`);
}

/**
 * Validate phone number (basic)
 */
function isValidPhoneNumber(number) {
  const cleaned = number.replace(/[^\d]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Normalize phone number to use in WhatsApp
 */
function normalizePhoneNumber(number) {
  let cleaned = number.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Check if message is from group
 */
function isFromGroup(chatId) {
  return chatId?.endsWith('@g.us') || false;
}

/**
 * Extract group ID from chat ID
 */
function getGroupId(chatId) {
  return isFromGroup(chatId) ? chatId : null;
}

/**
 * Extract user ID from sender
 */
function getUserId(sender) {
  return sender.replace(/@.+/, '');
}

/**
 * Clean URL (basic validation)
 */
function isUrl(text) {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect common WhatsApp invite links
 */
function isWhatsAppInviteLink(text) {
  const patterns = [
    /chat\.whatsapp\.com\/[a-zA-Z0-9]+/gi,
    /whatsapp\.com\/join\/[a-zA-Z0-9]+/gi,
    /wa\.me\/\d+/gi,
  ];
  return patterns.some(pattern => pattern.test(text));
}

/**
 * Create safe filename from text
 */
function createSafeFilename(text) {
  return text
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .substring(0, 50)
    .toLowerCase();
}

/**
 * Delete file safely
 */
async function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (error) {
    // Silent fail
  }
  return false;
}

/**
 * Get file size in human readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Sleep for given milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Escape special characters for messages
 */
function escapeMessage(text) {
  return text
    .replace(/[_*~`]/g, '\\$&')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]');
}

/**
 * Create boxed message format
 */
function boxMessage(title, ...lines) {
  const maxLength = Math.max(
    title.length,
    ...lines.map(l => (typeof l === 'string' ? l : String(l)).length)
  ) + 4;

  let msg = '╭' + '━'.repeat(maxLength) + '╮\n';
  msg += '┃ ' + title.padEnd(maxLength - 2) + ' ┃\n';
  
  for (const line of lines) {
    const text = typeof line === 'string' ? line : String(line);
    msg += '┃ ' + text.padEnd(maxLength - 2) + ' ┃\n';
  }
  
  msg += '╰' + '━'.repeat(maxLength) + '╯';
  return msg;
}

module.exports = {
  formatTime,
  getUptime,
  formatMs,
  parseCommand,
  generateMentions,
  isValidPhoneNumber,
  normalizePhoneNumber,
  isFromGroup,
  getGroupId,
  getUserId,
  isUrl,
  isWhatsAppInviteLink,
  createSafeFilename,
  deleteFile,
  formatFileSize,
  sleep,
  escapeMessage,
  boxMessage,
};
