const { isJidBroadcast, proto } = require('@whiskeysockets/baileys');
const logger = require('../lib/logger');
const { isFromGroup } = require('../lib/utils');

function unwrapMessage(message) {
  if (!message || typeof message !== 'object') return message;

  if (message.ephemeralMessage?.message) {
    return unwrapMessage(message.ephemeralMessage.message);
  }
  if (message.viewOnceMessage?.message) {
    return unwrapMessage(message.viewOnceMessage.message);
  }
  if (message.viewOnceMessageV2?.message) {
    return unwrapMessage(message.viewOnceMessageV2.message);
  }
  if (message.viewOnceMessageV2Extension?.message) {
    return unwrapMessage(message.viewOnceMessageV2Extension.message);
  }
  if (message.documentWithCaptionMessage?.message) {
    return unwrapMessage(message.documentWithCaptionMessage.message);
  }
  if (message.editedMessage?.message) {
    return unwrapMessage(message.editedMessage.message);
  }
  if (message.layerMessage?.message) {
    return unwrapMessage(message.layerMessage.message);
  }

  return message;
}

function extractText(message) {
  if (!message) return '';
  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    message.documentMessage?.caption ||
    message.buttonsResponseMessage?.selectedButtonId ||
    message.listResponseMessage?.singleSelectReply?.selectedRowId ||
    message.templateButtonReplyMessage?.selectedId ||
    message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ||
    ''
  );
}

async function normalizeMessage(message) {
  try {
    const unwrapped = unwrapMessage(message) || {};
    const text = String(extractText(unwrapped) || '').trim();
    const type =
      unwrapped.conversation ? 'conversation'
        : unwrapped.extendedTextMessage ? 'extendedTextMessage'
          : Object.keys(unwrapped).find((key) => key !== 'messageContextInfo' && key !== 'senderKeyDistributionMessage') || 'unknown';

    return {
      type,
      content: unwrapped[type] || unwrapped,
      raw: unwrapped,
      text,
      isMedia: ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage'].includes(type),
    };
  } catch (error) {
    logger.error('Failed to normalize message:', error);
    return {
      type: 'unknown',
      content: null,
      raw: message,
      text: '',
      isMedia: false,
    };
  }
}

function extractMetadata(key, message) {
  const sender =
    key.participant ||
    key.participantAlt ||
    key.participantPn ||
    key.senderPn ||
    key.remoteJidAlt ||
    key.remoteJid;
  const altSender =
    key.participantAlt ||
    key.participantPn ||
    key.senderPn ||
    key.remoteJidAlt ||
    key.senderLid ||
    null;

  return {
    from: sender,
    sender,
    participant: key.participant || null,
    participantAlt: key.participantAlt || key.participantPn || null,
    remoteJidAlt: key.remoteJidAlt || null,
    senderPn: key.senderPn || key.participantPn || message?.senderPn || null,
    senderLid: key.senderLid || key.participantLid || null,
    altSender,
    addressingMode: key.addressingMode || null,
    jid: key.remoteJid,
    messageId: key.id,
    timestamp: Date.now(),
    isGroup: isFromGroup(key.remoteJid),
    isFromMe: Boolean(key.fromMe),
    isReply: !!key.quoted,
    key,
  };
}

function shouldProcessMessage(metadata, normalizedMessage) {
  if (isJidBroadcast(metadata.jid)) {
    return false;
  }

  if (!normalizedMessage.text) {
    return false;
  }

  return true;
}

async function buildContext(socket, message, key, normalizedMessage, metadata) {
  try {
    const groupId = metadata.isGroup ? metadata.jid : null;
    let groupMetadata = null;

    if (groupId) {
      try {
        groupMetadata = await socket.groupMetadata(groupId);
      } catch (error) {
        logger.warn('Failed to fetch group metadata:', error.message);
      }
    }

    const rawContent = normalizedMessage.raw || normalizedMessage.content || {};
    const rawContextInfo =
      rawContent.contextInfo ||
      rawContent.extendedTextMessage?.contextInfo ||
      rawContent.imageMessage?.contextInfo ||
      rawContent.videoMessage?.contextInfo ||
      rawContent.documentMessage?.contextInfo ||
      rawContent.audioMessage?.contextInfo ||
      null;

    let quotedMessage = null;
    let quotedKey = null;

    if (rawContextInfo?.quotedMessage && rawContextInfo?.stanzaId) {
      quotedKey = {
        remoteJid: metadata.jid,
        fromMe: Boolean(rawContextInfo.participant === socket.user?.id),
        id: rawContextInfo.stanzaId,
        participant: rawContextInfo.participant,
      };

      quotedMessage = proto.WebMessageInfo.create({
        key: quotedKey,
        message: rawContextInfo.quotedMessage,
      });
    }

    return {
      socket,
      message,
      key,
      sender: metadata.from,
      senderPn: metadata.senderPn,
      senderLid: metadata.senderLid,
      senderName: groupMetadata?.participants?.find(p => p.id === metadata.from)?.pushName || metadata.from.split('@')[0],
      jid: metadata.jid,
      groupId,
      groupName: groupMetadata?.subject || 'Unknown',
      groupMetadata,
      messageType: normalizedMessage.type,
      messageText: normalizedMessage.text,
      isGroup: metadata.isGroup,
      isReply: Boolean(quotedMessage),
      quotedMessage: quotedMessage?.message || null,
      quotedMessageInfo: quotedMessage,
      quotedKey,
      timestamp: metadata.timestamp,
      commands: null,

      reply: async (text) => {
        try {
          await socket.sendMessage(metadata.jid, { text }, { quoted: message });
        } catch (error) {
          logger.error('Failed to send reply:', error);
        }
      },

      replyWithMention: async (text, mentions = []) => {
        try {
          await socket.sendMessage(metadata.jid, { text, mentions }, { quoted: message });
        } catch (error) {
          logger.error('Failed to send mentioned reply:', error);
        }
      },

      sendMessage: async (text, quoted = false) => {
        try {
          const options = quoted ? { quoted: message } : {};
          await socket.sendMessage(metadata.jid, { text }, options);
        } catch (error) {
          logger.error('Failed to send message:', error);
        }
      },
    };
  } catch (error) {
    logger.error('Failed to build context:', error);
    return null;
  }
}

module.exports = {
  normalizeMessage,
  extractMetadata,
  shouldProcessMessage,
  buildContext,
  unwrapMessage,
};
