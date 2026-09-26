const { downloadContentFromMessage, jidNormalizedUser } = require('@whiskeysockets/baileys');
const config = require('../config/config');
const { unwrapMessage } = require('../handler/message');
const {
  sameIdentity,
  isOwner,
  isOwnerSender: permissionIsOwnerSender,
  getOwnerSendJids,
  rememberOwnerJid,
} = require('./permissions');
const logger = require('./logger');

const VV2_EMOJIS = new Set(['🔥', '❣️', '❤‍🔥', '❤', '❤️', '👀']);

function normalizeEmoji(text) {
  return String(text || '')
    .replace(/\uFE0F/g, '')
    .replace(/\u200D/g, '')
    .trim();
}

function isVv2ReactionEmoji(text) {
  const raw = String(text || '').trim();
  if (!raw) return false;
  if (VV2_EMOJIS.has(raw)) return true;
  const normalized = normalizeEmoji(raw);
  return normalized === '🔥' || normalized === '❣' || normalized === '❤' || normalized === '👀';
}

function getOwnerJid(socket, preferred) {
  const jids = getOwnerSendJids(socket, preferred);
  if (jids.length) return jids[0];
  const owner = String(config.OWNER_NUMBER || '').replace(/\D/g, '');
  if (owner) return `${owner}@s.whatsapp.net`;
  try {
    return jidNormalizedUser(socket?.user?.id);
  } catch {
    return '';
  }
}

function isOwnerSender(socket, key, extra) {
  return permissionIsOwnerSender(socket, key, extra);
}

function extractViewOnceMedia(messageContent) {
  if (!messageContent || typeof messageContent !== 'object') return null;

  const viewOnceContainer =
    messageContent.viewOnceMessage?.message ||
    messageContent.viewOnceMessageV2?.message ||
    messageContent.viewOnceMessageV2Extension?.message ||
    null;

  const source = viewOnceContainer || unwrapMessage(messageContent) || messageContent;

  if (source.imageMessage) return { type: 'image', data: source.imageMessage };
  if (source.videoMessage) return { type: 'video', data: source.videoMessage };
  if (source.audioMessage) return { type: 'audio', data: source.audioMessage };
  return null;
}

async function downloadMedia(media) {
  const stream = await downloadContentFromMessage(media.data, media.type);
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  if (!buffer.length) {
    throw new Error('Downloaded media is empty');
  }
  return buffer;
}

function buildPayload(media, buffer) {
  const caption = media.data.caption || '';
  if (media.type === 'image') {
    return { image: buffer, caption };
  }
  if (media.type === 'video') {
    return { video: buffer, caption, mimetype: media.data.mimetype || 'video/mp4' };
  }
  return {
    audio: buffer,
    mimetype: media.data.mimetype || 'audio/mpeg',
    ptt: Boolean(media.data.ptt),
  };
}

async function sendToOwnerTargets(socket, payload, targets, quoted) {
  const options = quoted ? { quoted } : {};
  const unique = [...new Set((targets || []).filter(Boolean))];
  let lastError = null;

  for (const targetJid of unique) {
    try {
      await socket.sendMessage(targetJid, payload, options);
      rememberOwnerJid(targetJid);
      return { ok: true, targetJid };
    } catch (error) {
      lastError = error;
      logger.warn(`Failed to send to ${targetJid}: ${error.message}`);
    }
  }

  throw lastError || new Error('No reachable owner chat');
}

async function sendViewOnceMedia(socket, media, targetJid, quoted) {
  const buffer = await downloadMedia(media);
  const payload = buildPayload(media, buffer);
  const targets = Array.isArray(targetJid) ? targetJid : getOwnerSendJids(socket, targetJid);
  const result = await sendToOwnerTargets(socket, payload, targets, quoted);
  return result;
}

async function recoverViewOnce(socket, messageContent, { targetJid, quoted } = {}) {
  const targets = Array.isArray(targetJid)
    ? targetJid
    : getOwnerSendJids(socket, targetJid);

  if (!targets.length) {
    return { ok: false, error: 'No private chat target is configured.' };
  }

  const media = extractViewOnceMedia(messageContent);
  if (!media) {
    return { ok: false, error: 'Please reply to a view-once image, video, or audio.' };
  }

  try {
    const result = await sendViewOnceMedia(socket, media, targets, quoted);
    return { ok: true, targetJid: result.targetJid };
  } catch (error) {
    logger.error('Failed to recover view-once media:', error);
    return { ok: false, error: 'Failed to recover the view-once media. It may have expired or be unavailable.' };
  }
}

async function sendOwnerText(socket, text, preferred) {
  const targets = getOwnerSendJids(socket, preferred);
  if (!targets.length) return { ok: false };
  try {
    const result = await sendToOwnerTargets(socket, { text }, targets);
    return { ok: true, targetJid: result.targetJid };
  } catch (error) {
    logger.warn(`Failed to send owner text: ${error.message}`);
    return { ok: false, error: error.message };
  }
}

module.exports = {
  isVv2ReactionEmoji,
  getOwnerJid,
  isOwnerSender,
  extractViewOnceMedia,
  recoverViewOnce,
  sendOwnerText,
  sameIdentity,
  isOwner,
};
