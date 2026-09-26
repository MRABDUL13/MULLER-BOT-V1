const fs = require('fs');
const path = require('path');

// Load .env without requiring dotenv. This keeps the bot compatible with
// hosting panels that start the application before running npm install.
function loadEnvFile(file = path.join(process.cwd(), '.env')) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const index = line.indexOf('=');
    if (index < 1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('\"') && value.endsWith('\"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile();

const config = {
  // Bot Configuration
  BOT_NAME: process.env.BOT_NAME || 'MULLER BOT',
  OWNER_NUMBER: process.env.OWNER_NUMBER || '2347065178640',
  OWNER_LID: process.env.OWNER_LID || '',
  PREFIX: process.env.PREFIX || '.',
  MODE: process.env.MODE || 'public', // public or private
  BOT_LOGO: process.env.BOT_LOGO || path.join(process.cwd(), 'assets', 'logo.png'),

  // Authentication
  AUTH_METHOD: process.env.AUTH_METHOD || 'pairing', // pairing or qr
  PHONE_NUMBER: process.env.PHONE_NUMBER || '',

  // Paths
  SESSION_DIR: process.env.SESSION_DIR || path.join(process.cwd(), 'sessions'),
  DATA_DIR: process.env.DATA_DIR || path.join(process.cwd(), 'data'),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Database
  DB_TYPE: process.env.DB_TYPE || 'json',
  DB_PATH: process.env.DB_PATH || path.join(process.cwd(), 'data', 'db.json'),

  // Features
  AUTO_RECONNECT: true,
  AUTO_RECONNECT_INTERVAL: 5000, // ms
  MAX_RECONNECT_ATTEMPTS: 5,
  MESSAGE_RETRY_INTERVAL: 1000,

  DASHBOARD_PORT: Number(process.env.DASHBOARD_PORT || process.env.PORT || 3000),

  // Rate limiting
  RATE_LIMIT_ENABLED: true,
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 30,

  // Validation
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_MEDIA_TYPES: ['image', 'video', 'audio', 'document'],
};

function splitOwnerValue(value) {
  const raw = String(value || '').trim();
  if (!raw) return { number: '', lid: '', jid: '' };
  const cleaned = raw.replace(/^whatsapp:/i, '').replace(/^\+/, '');
  if (cleaned.includes('@')) {
    const [user, domain] = cleaned.split('@');
    if (String(domain).toLowerCase() === 'lid') {
      return { number: '', lid: user, jid: `${user}@lid` };
    }
    return { number: user.replace(/\D/g, ''), lid: '', jid: cleaned };
  }
  return { number: cleaned.replace(/\D/g, '') || cleaned, lid: '', jid: '' };
}

const parsedOwner = splitOwnerValue(config.OWNER_NUMBER);
if (parsedOwner.lid && !config.OWNER_LID) config.OWNER_LID = parsedOwner.lid;
if (parsedOwner.number) {
  config.OWNER_NUMBER = parsedOwner.number;
} else if (parsedOwner.lid) {
  config.OWNER_NUMBER = '';
}
if (config.OWNER_LID) {
  config.OWNER_LID = String(config.OWNER_LID).replace(/^@/, '').replace(/@lid$/i, '');
}

// Ensure paths exist (created by bot on startup)
[config.SESSION_DIR, config.DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

module.exports = config;
