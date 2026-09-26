#!/usr/bin/env node

require('./lib/bootstrap').ensureDependencies();

const config = require('./config/config');
const logger = require('./lib/logger');
const healthcheck = require('./lib/healthcheck');
const backup = require('./lib/backup');
const { startConnection } = require('./handler/connection');
const { setupEventHandlers } = require('./handler/events');
const { loadCommands } = require('./handler/commands');
const store = require('./lib/store');

let activeSocket = null;
let commandsCache = null;
const boundSockets = new WeakSet();

function attachSocketHandlers(sock) {
  if (!sock || boundSockets.has(sock)) return;
  boundSockets.add(sock);
  activeSocket = sock;

  sock.ev.on('connection.update', (update) => {
    if (update.connection === 'open') {
      healthcheck.setConnected(true);
      logger.info('Health check: Connected');
    } else if (update.connection === 'close') {
      healthcheck.setConnected(false);
      logger.warn('Health check: Disconnected');
    }
  });

  setupEventHandlers(sock, commandsCache);

  sock.ev.on('messages.upsert', () => {
    healthcheck.recordMessage();
  });
}

async function initialize() {
  try {
    logger.info('Starting MULLER BOT...');
    logger.info(`Configuration loaded: ${config.BOT_NAME}`);
    logger.info(`Mode: ${config.MODE} | Prefix: ${config.PREFIX}`);

    await store.initialize();
    logger.info('Store initialized');

    commandsCache = await loadCommands();
    logger.info(`Loaded ${commandsCache.size} commands`);

    backup.startAutoBackup(6);
    logger.info('Automatic backups enabled (6-hour interval)');

    const sock = await startConnection(attachSocketHandlers);
    attachSocketHandlers(sock);

    setInterval(() => {
      healthcheck.logStatus();
    }, 30 * 60 * 1000);

    const dashboard = require('./lib/dashboard');
    const dashboardPort = Number(config.DASHBOARD_PORT || process.env.PORT || 3000);
    dashboard.start(dashboardPort, healthcheck);
    logger.info(`Web dashboard available at http://localhost:${dashboardPort}`);

    logger.info('MULLER BOT is ready!');
    logger.info('Tip: Use "node cli.js help" for CLI commands');
    logger.info('Try sending: .menu');

    process.on('SIGINT', async () => {
      logger.warn('Shutting down gracefully...');
      await handleShutdown(activeSocket);
    });

    process.on('SIGTERM', async () => {
      logger.warn('Termination signal received');
      await handleShutdown(activeSocket);
    });
  } catch (error) {
    logger.error('Failed to initialize bot:', error);
    process.exit(1);
  }
}

async function handleShutdown(sock) {
  try {
    logger.info('Creating shutdown backup...');
    await backup.backup();
    await backup.cleanupOldBackups(10);
    await store.close();

    // Do not logout. Logout unlinks the device and forces pairing on every restart.
    if (sock?.end) {
      try { sock.end(undefined); } catch {}
    }

    logger.info('Bot shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

initialize();
