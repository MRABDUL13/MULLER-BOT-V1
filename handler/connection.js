const path = require('path');
const fs = require('fs');
const pino = require('pino');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers,
} = require('@whiskeysockets/baileys');
const config = require('../config/config');
const logger = require('../lib/logger');
const { sleep } = require('../lib/utils');
const pairing = require('../lib/pairing');

let reconnectAttempts = 0;
let hasConnectedOnce = false;
let badSessionRetries = 0;
let onSocketCreated = null;
let reconnecting = false;
const MAX_BAD_SESSION_RETRIES = 3;
const baileysLogger = pino({ level: 'silent' });

function getDisconnectStatus(lastDisconnect) {
  const err = lastDisconnect?.error;
  return (
    err?.output?.statusCode ||
    err?.statusCode ||
    err?.data?.statusCode ||
    0
  );
}

function formatPairingCode(code) {
  if (!code) return '';
  const raw = String(code).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return raw.replace(/(.{4})/g, '$1-').replace(/-$/, '');
}

async function requestPairingCode(sock) {
  if (!config.PHONE_NUMBER) {
    logger.error('AUTH_METHOD=pairing but PHONE_NUMBER is missing in your .env');
    return;
  }
  if (sock.authState?.creds?.registered) return;

  const phone = String(config.PHONE_NUMBER).replace(/[^0-9]/g, '');
  if (phone.length < 10) {
    logger.error('PHONE_NUMBER looks invalid. Use country code + number, digits only (example: 2348012345678)');
    return;
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      if (typeof sock.requestPairingCode !== 'function') {
        logger.error('This Baileys version does not support pairing codes. Use AUTH_METHOD=qr or update @whiskeysockets/baileys to 6.7.x');
        return;
      }
      const code = await sock.requestPairingCode(phone);
      const pretty = formatPairingCode(code);
      pairing.setCode(pretty || code, phone);
      logger.info(`Your pairing code: ${pretty || code}`);
      logger.info('WhatsApp > Linked Devices > Link a Device > Link with phone number');
      logger.info('Enter the code above. It expires in about 60 seconds.');
      return;
    } catch (error) {
      logger.warn(`Pairing code request failed (attempt ${attempt}/3): ${error.message}`);
      await sleep(2000);
    }
  }
}

async function startConnection(onCreated) {
  if (typeof onCreated === 'function') {
    onSocketCreated = onCreated;
  }

  try {
    logger.info('Initializing WhatsApp connection...');
    reconnecting = false;

    const { state, saveCreds } = await useMultiFileAuthState(config.SESSION_DIR);
    const usePairingCode = (config.AUTH_METHOD || 'pairing') === 'pairing';

    let version;
    try {
      const latest = await fetchLatestBaileysVersion();
      version = latest.version;
      logger.info(`Using WhatsApp Web version ${version.join('.')}`);
    } catch (error) {
      logger.warn(`Could not fetch latest WA version: ${error.message}`);
    }

    const sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, baileysLogger),
      },
      logger: baileysLogger,
      browser: usePairingCode
        ? (Browsers?.ubuntu ? Browsers.ubuntu('Chrome') : ['Ubuntu', 'Chrome', '20.0.04'])
        : (Browsers?.macOS ? Browsers.macOS('Chrome') : ['MULLER BOT', 'Chrome', '1.0.0']),
      syncFullHistory: false,
      markOnlineOnConnect: true,
      connectTimeoutMs: 60_000,
      defaultQueryTimeoutMs: 0,
      keepAliveIntervalMs: 30_000,
      emitOwnEvents: true,
      fireInitQueries: true,
      generateHighQualityLinkPreview: true,
      getMessage: async () => ({ conversation: '' }),
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr && !usePairingCode) {
        try {
          const qrcode = require('qrcode-terminal');
          logger.info('Scan this QR code with WhatsApp > Linked Devices');
          qrcode.generate(qr, { small: true });
        } catch {
          logger.info('QR received. Install qrcode-terminal to print it, or switch AUTH_METHOD=pairing');
        }
      }

      if (connection === 'open') {
        reconnectAttempts = 0;
        badSessionRetries = 0;
        hasConnectedOnce = true;
        pairing.setConnected(true);
        logger.info('MULLER BOT connected successfully!');
        logger.info(`Bot Number: ${sock.user?.id?.split(':')[0] || 'unknown'}`);
        try {
          const { rememberOwnerJid, rememberLidMapping } = require('../lib/permissions');
          const me = sock.user || {};
          const botUser = String(me.id || '').split(':')[0];
          const ownerDigits = String(config.OWNER_NUMBER || '').replace(/\D/g, '');
          const botDigits = String(botUser || '').replace(/\D/g, '');
          const sameAccount = ownerDigits && botDigits && (ownerDigits === botDigits || ownerDigits.endsWith(botDigits) || botDigits.endsWith(ownerDigits));
          if (me.id) rememberOwnerJid(me.id);
          if (me.lid) rememberOwnerJid(me.lid);
          if (me.jid) rememberOwnerJid(me.jid);
          if (sameAccount && me.lid && ownerDigits) rememberLidMapping(me.lid, ownerDigits);
          if (ownerDigits && typeof sock.onWhatsApp === 'function') {
            const result = await sock.onWhatsApp(ownerDigits);
            const entries = Array.isArray(result) ? result : [result];
            for (const entry of entries) {
              if (!entry) continue;
              if (entry.jid) rememberOwnerJid(entry.jid);
              if (entry.lid) {
                rememberOwnerJid(entry.lid);
                rememberLidMapping(entry.lid, ownerDigits);
              }
            }
          }
        } catch (error) {
          logger.warn(`Could not resolve owner identities: ${error.message}`);
        }
        return;
      }

      if (connection === 'connecting') {
        logger.info('Connecting to WhatsApp...');
        return;
      }

      if (connection === 'close') {
        const statusCode = getDisconnectStatus(lastDisconnect);
        const reason = Object.keys(DisconnectReason).find(
          (key) => DisconnectReason[key] === statusCode
        ) || statusCode || 'unknown';
        logger.warn(`Connection closed (${reason})`);

        if (statusCode === DisconnectReason.loggedOut) {
          logger.warn('Logged out. Clearing session so you can pair again...');
          fs.rmSync(config.SESSION_DIR, { recursive: true, force: true });
          process.exit(0);
          return;
        }

        if (statusCode === DisconnectReason.connectionReplaced) {
          logger.warn('Connection replaced by another session. Exiting...');
          process.exit(0);
          return;
        }

        if (statusCode === DisconnectReason.badSession) {
          badSessionRetries++;
          if (!hasConnectedOnce && badSessionRetries <= MAX_BAD_SESSION_RETRIES) {
            logger.warn(`Bad session signal (${badSessionRetries}/${MAX_BAD_SESSION_RETRIES}) after pairing — retrying...`);
          } else {
            logger.warn('Bad session, clearing and restarting...');
            fs.rmSync(config.SESSION_DIR, { recursive: true, force: true });
            process.exit(0);
            return;
          }
        }

        if (statusCode === DisconnectReason.restartRequired) {
          logger.warn('Restart required (normal after pairing). Reconnecting with saved session...');
        }

        if (config.AUTO_RECONNECT && reconnectAttempts < config.MAX_RECONNECT_ATTEMPTS) {
          if (reconnecting) return;
          reconnecting = true;
          reconnectAttempts++;
          logger.info(`Reconnect attempt ${reconnectAttempts}/${config.MAX_RECONNECT_ATTEMPTS}`);
          await sleep(config.AUTO_RECONNECT_INTERVAL);
          await startConnection(onSocketCreated);
        } else if (reconnectAttempts >= config.MAX_RECONNECT_ATTEMPTS) {
          logger.error('Max reconnection attempts reached. Exiting...');
          process.exit(1);
        }
      }
    });

    if (typeof onSocketCreated === 'function') {
      onSocketCreated(sock);
    }

    if (usePairingCode && !sock.authState.creds.registered) {
      await sleep(2500);
      await requestPairingCode(sock);
    }

    return sock;
  } catch (error) {
    logger.error('Failed to start connection:', error);
    throw error;
  }
}

module.exports = {
  startConnection,
};
