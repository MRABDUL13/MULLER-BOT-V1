const config = require('../config/config');
const logger = require('../lib/logger');
const database = require('../lib/database');
const permissions = require('../lib/permissions');
const { parseCommand } = require('../lib/utils');
const {
  normalizeMessage,
  extractMetadata,
  shouldProcessMessage,
  buildContext,
} = require('./message');
const { getCommand } = require('./commands');

/**
 * Main message handler - processes all incoming messages
 */
async function handleMessage(socket, message, commands) {
  const startTime = Date.now();

  try {
    // Extract metadata (includes LID / PN alternate JIDs)
    const metadata = extractMetadata(message.key, message);

    // Normalize message content
    const normalizedMessage = await normalizeMessage(message.message);

    // Check if we should process this message
    if (!shouldProcessMessage(metadata, normalizedMessage)) {
      return;
    }

    // Check if user is blocked
    if (await database.isBlocked(metadata.from)) {
      logger.warn(`Ignoring message from blocked user: ${metadata.from}`);
      return;
    }

    // Group middleware: enforce mute/antilink settings before command parsing.
    if (ctxSafeGroup(metadata)) {
      try {
        const groupSettings = await database.getGroupSettings(metadata.jid);
        if (groupSettings[`mute:${metadata.from}`]) {
          await socket.sendMessage(metadata.jid, { delete: message.key }).catch(() => {});
          return;
        }
        if (groupSettings.antilink && /(https?:\/\/|wa\.me\/|chat\.whatsapp\.com\/)/i.test(normalizedMessage.text || '')) {
          await socket.sendMessage(metadata.jid, { delete: message.key }).catch(() => {});
          return;
        }
      } catch (middlewareError) {
        logger.warn('Group middleware error:', middlewareError.message);
      }
    }

    const parsed = parseCommand(normalizedMessage.text || '', config.PREFIX);
    if (!parsed) {
      return;
    }

    if (String(config.MODE).toLowerCase() === 'private') {
      const extra = {
        fromMe: metadata.isFromMe,
        participantAlt: metadata.participantAlt,
        remoteJidAlt: metadata.remoteJidAlt,
        senderPn: metadata.senderPn,
        senderLid: metadata.senderLid,
        remoteJid: metadata.jid,
        participant: metadata.participant,
      };
      const senderId = metadata.sender || metadata.participant || message.key.participant || message.key.remoteJid || metadata.from;
      if (!(await permissions.isOwnerAsync(senderId, extra, socket, metadata.isGroup ? metadata.jid : null))) {
        return;
      }
    }

    const { command: commandName, args } = parsed;

    // Get command
    const command = getCommand(commands, commandName);
    if (!command) {
      return; // Unknown command
    }

    // Note: fromMe messages (including self-chat) are allowed through here
    // because they only reach this point if they matched a real command —
    // anything else fromMe was already filtered out by the checks above.

    // Build execution context
    const ctx = await buildContext(socket, message, message.key, normalizedMessage, metadata);
    if (!ctx) {
      logger.error('Failed to build command context');
      return;
    }

    // Expose the loaded command registry to commands such as .menu and .commandlist.
    ctx.commands = commands;

    // Check permission
    let userPermissionLevel = 0;
    if (command.permission) {
      const extra = {
        fromMe: metadata.isFromMe,
        participantAlt: metadata.participantAlt,
        remoteJidAlt: metadata.remoteJidAlt,
        senderPn: metadata.senderPn,
        senderLid: metadata.senderLid,
        remoteJid: metadata.jid,
        participant: metadata.participant,
        key: message.key,
      };
      userPermissionLevel = await permissions.checkPermission(
        socket,
        metadata.sender || metadata.from,
        ctx.groupId,
        command.permission,
        metadata.isFromMe,
        extra
      );

      const requiredLevel = permissions.PERMISSION_LEVELS[command.permission] || 0;
      if (userPermissionLevel < requiredLevel) {
        logger.logPermissionDenied(
          commandName,
          metadata.from,
          `Requires ${command.permission}, has ${permissions.getPermissionName(userPermissionLevel)}`
        );

        await ctx.reply('❌ You do not have permission to use this command.');
        return;
      }
    }

    // Verify group context if required
    if (command.groupOnly && !ctx.isGroup) {
      await ctx.reply('❌ This command can only be used in groups.');
      return;
    }

    // Verify private context if required
    if (command.privateOnly && ctx.isGroup) {
      await ctx.reply('❌ This command can only be used in private chat.');
      return;
    }

    // Log command execution
    logger.logCommand(
      commandName,
      metadata.from,
      ctx.groupId ? ctx.groupMetadata?.subject : null
    );

    // Execute command
    ctx.args = args;
    await command.execute(ctx);

    const duration = Date.now() - startTime;
    logger.debug(`Command ${commandName} executed in ${duration}ms`);

  } catch (error) {
    logger.error('Message handler error:', error);

    try {
      const ctx = await buildContext(socket, message, message.key, { text: '' }, extractMetadata(message.key, message));
      if (ctx) {
        await ctx.reply('❌ An error occurred while processing your command.');
      }
    } catch (replyError) {
      logger.error('Failed to send error message:', replyError);
    }
  }
}

function ctxSafeGroup(metadata) {
  return Boolean(metadata?.isGroup && metadata?.jid);
}

module.exports = {
  handleMessage,
};
