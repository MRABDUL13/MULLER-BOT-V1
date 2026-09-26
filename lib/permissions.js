const config = require('../config/config');

let jidNormalizedUser = (jid) => String(jid || '').replace(/:\d+(?=@)/, '');
try {
  ({ jidNormalizedUser } = require('@whiskeysockets/baileys'));
} catch {}

const PERMISSION_LEVELS = {
  USER: 0,
  GROUP_ADMIN: 1,
  BOT_ADMIN: 2,
  OWNER: 3,
};

const extraOwnerJids = new Set();
const lidToPn = new Map();
const pnToLid = new Map();
let persistedLoaded = false;
let persistTimer = null;

function stripDevice(jid) {
  return String(jid || '').replace(/:\d+(?=@)/, '').trim();
}

function extractUser(jid) {
  return stripDevice(jid).split('@')[0].split(':')[0].replace(/^\+/, '').toLowerCase();
}

function extractDomain(jid) {
  const raw = String(jid || '');
  const at = raw.lastIndexOf('@');
  return at >= 0 ? raw.slice(at + 1).toLowerCase() : '';
}

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

function isLidJid(jid) {
  return extractDomain(jid) === 'lid' || /@lid\b/i.test(String(jid || ''));
}

function isGroupLikeJid(jid) {
  const domain = extractDomain(jid);
  return domain === 'g.us' || domain === 'broadcast' || domain === 'newsletter' || domain === 'call';
}

function isUserJid(jid) {
  const domain = extractDomain(jid);
  return domain === 's.whatsapp.net' || domain === 'c.us' || domain === 'lid' || domain === 'hosted' || domain === 'hosted.lid';
}

function phoneMatch(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length >= 8 && b.length >= 8 && (a.endsWith(b) || b.endsWith(a))) return true;
  return false;
}

function looksLikeIdentity(raw) {
  if (!raw) return false;
  if (raw.includes('@')) return true;
  return /^\+?\d{8,18}$/.test(String(raw).replace(/[\s-]/g, ''));
}

function addJid(out, value) {
  if (!value) return;
  const raw = String(value).trim();
  if (!raw || !looksLikeIdentity(raw)) return;
  out.add(raw);
  const stripped = stripDevice(raw);
  if (stripped) out.add(stripped);
  out.add(raw.toLowerCase());
  if (stripped) out.add(stripped.toLowerCase());
}

function collectJidsFromValue(value, out = new Set()) {
  if (value == null || value === false || value === true) return out;
  if (typeof value === 'number') return out;
  if (Array.isArray(value)) {
    for (const item of value) collectJidsFromValue(item, out);
    return out;
  }
  if (typeof value === 'object') {
    const keys = [
      'id', 'jid', 'lid', 'pn', 'wid', 'participant', 'participantAlt', 'participantPn',
      'participantLid', 'remoteJid', 'remoteJidAlt', 'senderPn', 'senderLid', 'sender_pn',
      'phoneNumber', 'from', 'sender', 'identities', 'user', 'me',
    ];
    for (const key of keys) {
      if (value[key] != null) collectJidsFromValue(value[key], out);
    }
    if (Array.isArray(value.senderIdentities)) collectJidsFromValue(value.senderIdentities, out);
    return out;
  }
  addJid(out, value);
  return out;
}

function collectIdentities(...values) {
  const jids = new Set();
  for (const value of values) collectJidsFromValue(value, jids);

  const users = new Set();
  const lids = new Set();
  const pns = new Set();

  for (const jid of [...jids]) {
    const raw = String(jid);
    if (!raw) continue;
    if (isGroupLikeJid(raw)) continue;

    const user = extractUser(raw);
    if (user) users.add(user);

    if (isLidJid(raw)) {
      if (user) lids.add(user);
      const mapped = lidToPn.get(user) || lidToPn.get(digitsOnly(user));
      if (mapped) pns.add(mapped);
      continue;
    }

    if (!raw.includes('@')) {
      const digits = digitsOnly(raw);
      if (digits.length >= 8 && digits.length <= 15) pns.add(digits);
      else if (digits.length > 15) lids.add(digits);
      continue;
    }

    const digits = digitsOnly(user);
    if (digits) pns.add(digits);
  }

  return { jids, users, lids, pns };
}

function identitiesMatch(a, b) {
  const left = a && a.jids instanceof Set ? a : collectIdentities(a);
  const right = b && b.jids instanceof Set ? b : collectIdentities(b);

  for (const jid of left.jids) {
    const normalized = stripDevice(jid).toLowerCase();
    if (!normalized || isGroupLikeJid(normalized)) continue;
    for (const other of right.jids) {
      if (normalized === stripDevice(other).toLowerCase()) return true;
    }
  }

  for (const lid of left.lids) {
    if (right.lids.has(lid)) return true;
  }

  for (const pn of left.pns) {
    for (const other of right.pns) {
      if (phoneMatch(pn, other)) return true;
    }
  }

  return false;
}

function normalizeIdentity(value) {
  if (!value) return '';
  const raw = String(value).trim();
  if (isLidJid(raw) || isGroupLikeJid(raw)) return stripDevice(raw).toLowerCase();
  try {
    const normalized = jidNormalizedUser(raw);
    if (normalized) return stripDevice(normalized).toLowerCase();
  } catch {}
  return raw.replace(/^\+/, '').replace(/:.*?(?=@)/, '').toLowerCase();
}

function sameIdentity(a, b) {
  if (!a || !b) return false;
  return identitiesMatch(collectIdentities(a), collectIdentities(b));
}

function rememberLidMapping(lid, phone, persist = true) {
  const lidUser = extractUser(lid);
  const pn = digitsOnly(phone);
  if (!lidUser || pn.length < 8) return;
  lidToPn.set(lidUser, pn);
  pnToLid.set(pn, lidUser);
  if (persist) schedulePersist();
}

function loadPersistedOwnerJids() {
  if (persistedLoaded) return;
  persistedLoaded = true;
  try {
    const store = require('./store');
    const settings = store.getBotSettings() || {};
    const list = settings.OWNER_JIDS || settings.ownerJids || [];
    for (const jid of list) rememberOwnerJid(jid, false);
    const map = settings.OWNER_LID_MAP || settings.ownerLidMap || {};
    for (const [lid, pn] of Object.entries(map)) rememberLidMapping(lid, pn, false);
    if (settings.OWNER_LID) rememberOwnerJid(String(settings.OWNER_LID).includes('@') ? settings.OWNER_LID : `${settings.OWNER_LID}@lid`, false);
  } catch {}
}

function schedulePersist() {
  if (persistTimer) return;
  persistTimer = setTimeout(() => {
    persistTimer = null;
    try {
      const store = require('./store');
      store.setBotSetting('OWNER_JIDS', [...extraOwnerJids]).catch(() => {});
      store.setBotSetting('OWNER_LID_MAP', Object.fromEntries(lidToPn)).catch(() => {});
    } catch {}
  }, 250);
}

function rememberOwnerJid(jid, persist = true) {
  if (!jid) return;
  const raw = stripDevice(jid);
  if (!raw || isGroupLikeJid(raw)) return;
  if (!isUserJid(raw) && !raw.includes('@')) return;
  const before = extraOwnerJids.size;
  extraOwnerJids.add(raw);
  extraOwnerJids.add(raw.toLowerCase());
  if (isLidJid(raw)) {
    const ownerDigits = digitsOnly(config.OWNER_NUMBER);
    if (ownerDigits) rememberLidMapping(raw, ownerDigits, false);
  }
  if (persist && extraOwnerJids.size !== before) schedulePersist();
}

function ingestParticipantMapping(participant) {
  if (!participant || typeof participant !== 'object') return;
  const ids = [
    participant.id,
    participant.jid,
    participant.lid,
    participant.phoneNumber,
    participant.participant,
    participant.pn,
  ].filter(Boolean);
  const lid = ids.find((id) => isLidJid(id));
  const pn = ids.find((id) => !isLidJid(id) && !isGroupLikeJid(id) && digitsOnly(extractUser(id)).length >= 8);
  if (lid && pn) rememberLidMapping(lid, pn);
}

function collectParticipantIdentities(participant) {
  ingestParticipantMapping(participant);
  return collectIdentities(
    participant,
    participant?.id,
    participant?.jid,
    participant?.lid,
    participant?.phoneNumber,
    participant?.participant,
    participant?.pn
  );
}

function getConfiguredOwnerValues(socket) {
  const values = [
    config.OWNER_NUMBER,
    config.OWNER_LID,
    process.env.OWNER_NUMBER,
    process.env.OWNER_LID,
    process.env.OWNER_JID,
    ...extraOwnerJids,
  ];

  const ownerDigits = digitsOnly(config.OWNER_NUMBER);
  if (ownerDigits) {
    values.push(`${ownerDigits}@s.whatsapp.net`);
    values.push(`${ownerDigits}@c.us`);
  }

  if (config.OWNER_LID) {
    const lid = String(config.OWNER_LID);
    values.push(lid.includes('@') ? lid : `${lid}@lid`);
  }

  const me = socket?.user || socket?.authState?.creds?.me;
  if (me) {
    const botDigits = digitsOnly(extractUser(me.id || me.jid || ''));
    if (!ownerDigits || !botDigits || phoneMatch(ownerDigits, botDigits)) {
      values.push(me, me.id, me.lid, me.jid, me.phoneNumber);
    }
  }

  return values;
}

function getOwnerIdentities(socket) {
  loadPersistedOwnerJids();
  const values = getConfiguredOwnerValues(socket);
  const ownerDigits = digitsOnly(config.OWNER_NUMBER);
  if (ownerDigits && pnToLid.has(ownerDigits)) {
    values.push(`${pnToLid.get(ownerDigits)}@lid`);
  }
  for (const [lid, pn] of lidToPn) {
    if (ownerDigits && phoneMatch(pn, ownerDigits)) values.push(`${lid}@lid`);
  }
  return collectIdentities(...values);
}

function learnOwnerIdentities(senderIds) {
  if (!senderIds || !senderIds.jids) return;
  for (const jid of senderIds.jids) {
    if (isUserJid(jid)) rememberOwnerJid(jid);
  }
}

function isOwner(sender, extra, socket) {
  loadPersistedOwnerJids();
  if (extra && (extra.fromMe === true || extra.isFromMe === true)) {
    learnOwnerIdentities(collectIdentities(sender, extra, socket?.user));
    return true;
  }
  if (!sender && !extra) return false;

  const senderIds = collectIdentities(sender, extra);
  const ownerIds = getOwnerIdentities(socket);
  if (identitiesMatch(senderIds, ownerIds)) {
    learnOwnerIdentities(senderIds);
    return true;
  }
  return false;
}

async function resolveLidToPhone(socket, lidJid) {
  if (!socket || !lidJid) return '';
  const lidUser = extractUser(lidJid);
  if (lidToPn.has(lidUser)) return lidToPn.get(lidUser);

  try {
    const mapping = socket.signalRepository?.lidMapping;
    if (mapping) {
      const pn =
        (typeof mapping.getPNForLID === 'function' && (await mapping.getPNForLID(lidJid))) ||
        (typeof mapping.lidToPN === 'function' && (await mapping.lidToPN(lidJid))) ||
        mapping[lidJid] ||
        mapping[lidUser];
      if (pn) {
        rememberLidMapping(lidJid, pn);
        return digitsOnly(pn);
      }
    }
  } catch {}

  try {
    if (typeof socket.onWhatsApp === 'function') {
      const result = await socket.onWhatsApp(lidJid);
      const entries = Array.isArray(result) ? result : [result];
      for (const entry of entries) {
        if (!entry) continue;
        ingestParticipantMapping(entry);
        const pn = digitsOnly(extractUser(entry.jid || entry.pn || entry.phoneNumber || ''));
        if (pn.length >= 8) {
          rememberLidMapping(lidJid, pn);
          if (entry.jid) rememberOwnerJid(entry.jid);
          if (entry.lid) rememberOwnerJid(entry.lid);
          return pn;
        }
      }
    }
  } catch {}

  return '';
}

async function enrichFromGroup(socket, groupId) {
  if (!socket || !groupId) return;
  try {
    const meta = await socket.groupMetadata(groupId);
    for (const participant of meta.participants || []) {
      ingestParticipantMapping(participant);
    }
    return meta;
  } catch {
    return null;
  }
}

async function isOwnerAsync(sender, extra, socket, groupId) {
  if (isOwner(sender, extra, socket)) return true;
  if (groupId) await enrichFromGroup(socket, groupId);
  if (isOwner(sender, extra, socket)) return true;

  const senderIds = collectIdentities(sender, extra);
  for (const lid of senderIds.lids) {
    await resolveLidToPhone(socket, `${lid}@lid`);
  }
  return isOwner(sender, extra, socket);
}

function isOwnerSender(socket, key, extra) {
  if (!key && !extra) return false;
  if (key?.fromMe || extra?.fromMe) return true;
  const sender = key?.participant || key?.remoteJid || extra?.sender;
  return isOwner(sender, { ...key, ...extra }, socket);
}

function getOwnerSendJids(socket, preferred) {
  loadPersistedOwnerJids();
  const ordered = [];
  const seen = new Set();

  const add = (jid) => {
    if (!jid) return;
    const normalized = stripDevice(jid);
    if (!normalized || isGroupLikeJid(normalized) || !normalized.includes('@')) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    ordered.push(normalized);
  };

  if (Array.isArray(preferred)) {
    for (const jid of preferred) add(jid);
  } else {
    add(preferred);
  }
  for (const jid of extraOwnerJids) add(jid);

  const ownerDigits = digitsOnly(config.OWNER_NUMBER);
  if (ownerDigits) {
    add(`${ownerDigits}@s.whatsapp.net`);
    add(`${ownerDigits}@c.us`);
    const mappedLid = pnToLid.get(ownerDigits);
    if (mappedLid) add(`${mappedLid}@lid`);
  }

  if (config.OWNER_LID) {
    const lid = String(config.OWNER_LID);
    add(lid.includes('@') ? lid : `${lid}@lid`);
  }

  const me = socket?.user;
  if (me) {
    const botDigits = digitsOnly(extractUser(me.id || me.jid || ''));
    if (!ownerDigits || !botDigits || phoneMatch(ownerDigits, botDigits)) {
      add(me.id);
      add(me.lid);
      add(me.jid);
      try { add(jidNormalizedUser(me.id)); } catch {}
    }
  }

  return ordered;
}

function participantMatches(participant, sender, extra) {
  return identitiesMatch(
    collectParticipantIdentities(participant),
    collectIdentities(sender, extra)
  );
}

async function checkPermission(socket, sender, groupId, requiredLevel, isFromMe = false, extra = null) {
  if (isFromMe) {
    learnOwnerIdentities(collectIdentities(sender, extra, socket?.user));
    return PERMISSION_LEVELS.OWNER;
  }

  if (await isOwnerAsync(sender, extra, socket, groupId)) {
    return PERMISSION_LEVELS.OWNER;
  }

  if (!groupId) return PERMISSION_LEVELS.USER;

  try {
    const meta = await socket.groupMetadata(groupId);
    const participants = meta.participants || [];
    const isGroupAdmin = participants.some((p) => participantMatches(p, sender, extra) && p.admin);
    const botId = socket.user?.id || socket.user?.jid || socket.user?.lid;
    const isBotAdmin = participants.some((p) => participantMatches(p, botId, socket.user) && p.admin);
    if (isBotAdmin) return PERMISSION_LEVELS.BOT_ADMIN;
    if (isGroupAdmin) return PERMISSION_LEVELS.GROUP_ADMIN;
  } catch {}

  return PERMISSION_LEVELS.USER;
}

function hasPermission(userLevel, requiredLevel) {
  return userLevel >= requiredLevel;
}

function getPermissionName(level) {
  for (const [name, val] of Object.entries(PERMISSION_LEVELS)) {
    if (val === level) return name;
  }
  return 'UNKNOWN';
}

async function isGroupAdmin(socket, sender, groupId, extra = null) {
  if (!groupId) return false;
  try {
    const meta = await socket.groupMetadata(groupId);
    return (meta.participants || []).some((p) => participantMatches(p, sender, extra) && p.admin);
  } catch {
    return false;
  }
}

async function isBotAdmin(socket, groupId) {
  if (!groupId) return false;
  try {
    const botId = socket.user?.id || socket.user?.jid || socket.user?.lid;
    const meta = await socket.groupMetadata(groupId);
    return (meta.participants || []).some((p) => participantMatches(p, botId, socket.user) && p.admin);
  } catch {
    return false;
  }
}

module.exports = {
  PERMISSION_LEVELS,
  checkPermission,
  hasPermission,
  getPermissionName,
  isGroupAdmin,
  isBotAdmin,
  isOwner,
  isOwnerAsync,
  isOwnerSender,
  normalizeIdentity,
  sameIdentity,
  collectIdentities,
  rememberOwnerJid,
  getOwnerSendJids,
  identitiesMatch,
  rememberLidMapping,
};
