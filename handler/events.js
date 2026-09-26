const logger = require('../lib/logger');
const { handleMessage } = require('./handler');
const { unwrapMessage } = require('./message');
const { putMessage, getMessage } = require('../lib/message-cache');
const {
  isVv2ReactionEmoji,
  isOwnerSender,
  getOwnerJid,
  recoverViewOnce,
} = require('../lib/viewonce');

function lookupReactedMessage(msg, reactionKey) {
  const chatJid = reactionKey?.remoteJid || msg?.key?.remoteJid;
  return (
    getMessage({ remoteJid: chatJid, id: reactionKey?.id }) ||
    getMessage({ id: reactionKey?.id })
  );
}

async function handleVv2Reaction(socket, msg, reactionText, reactionKey) {
  if (!isVv2ReactionEmoji(reactionText)) return;
  if (!isOwnerSender(socket, msg.key, msg)) return;
  if (!reactionKey?.id) return;

  const original = lookupReactedMessage(msg, reactionKey);
  if (!original?.message) {
    logger.warn('vv2 reaction: original message not in cache');
    return;
  }

  const targetJid = getOwnerJid(socket, msg.key?.participant || msg.key?.remoteJid);
  const result = await recoverViewOnce(socket, original.message, { targetJid });
  if (!result.ok) {
    logger.warn(`vv2 reaction failed: ${result.error}`);
    if (targetJid) {
      await socket.sendMessage(targetJid, { text: result.error }).catch(() => {});
    }
  }
}

function setupEventHandlers(socket, commands) {
  socket.ev.on('messages.upsert', async (m) => {
    try {
      const incoming = m.messages || [];
      for (const msg of incoming) {
        if (msg?.key) putMessage(msg);

        const content = unwrapMessage(msg?.message) || msg?.message;
        const reaction = content?.reactionMessage;
        if (reaction?.text) {
          await handleVv2Reaction(socket, msg, reaction.text, reaction.key);
          continue;
        }

        if (!msg?.message) continue;
        if (msg.message.protocolMessage) continue;
        if (msg.message.senderKeyDistributionMessage && Object.keys(msg.message).length === 1) continue;

        await handleMessage(socket, msg, commands);
      }
    } catch (error) {
      logger.error('Error in messages.upsert handler:', error);
    }
  });

  socket.ev.on('messages.reaction', async (reactions) => {
    try {
      const items = Array.isArray(reactions) ? reactions : [reactions];
      for (const item of items) {
        const text = item?.reaction?.text || item?.text;
        const originalKey = item?.key;
        const reactorKey = item?.reaction?.key || {
          remoteJid: originalKey?.remoteJid,
          participant: item?.reaction?.senderJid,
          fromMe: item?.fromMe,
        };
        await handleVv2Reaction(
          socket,
          { key: reactorKey },
          text,
          originalKey
        );
      }
    } catch (error) {
      logger.error('Error in messages.reaction handler:', error);
    }
  });

  socket.ev.on('group-participants.update', async (update) => {
    try {
      const { id, participants, action } = update;

      logger.info(`Group update: ${action} | Group: ${id}`);
      const database = require('../lib/database');
      const settings = await database.getGroupSettings(id);
      const enabled = action === 'add' ? settings.welcome : action === 'remove' ? settings.goodbye : false;
      if (enabled) {
        const text = settings[action === 'add' ? 'welcomeMessage' : 'goodbyeMessage'] || (action === 'add' ? 'Welcome @user!' : 'Goodbye @user!');
        const mentions = participants || [];
        const rendered = mentions.map(j => text.replace(/@user/g, '@' + j.split('@')[0])).join(' ');
        await socket.sendMessage(id, { text: rendered || text, mentions });
      }
    } catch (error) {
      logger.error('Error in group-participants.update handler:', error);
    }
  });

  socket.ev.on('groups.update', async (updates) => {
    try {
      for (const update of updates) {
        const { id, ...changes } = update;
        logger.info(`Group metadata updated: ${id}`, changes);
      }
    } catch (error) {
      logger.error('Error in groups.update handler:', error);
    }
  });

  socket.ev.on('messages.delete', (message) => {
    try {
      logger.debug('Message deleted:', message.keys?.map(k => k.id));
    } catch (error) {
      logger.error('Error in messages.delete handler:', error);
    }
  });

  logger.info('Event handlers setup complete');
}

module.exports = {
  setupEventHandlers,
};
