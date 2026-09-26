/**
 * Optional Web Dashboard for MULLER BOT
 * Provides HTTP API and web UI for monitoring
 * 
 * Usage:
 * 1. npm install express cors body-parser
 * 2. const dashboard = require('./lib/dashboard');
 * 3. dashboard.start(3000); // Start on port 3000
 * 4. Open http://localhost:3000 in browser
 */

const http = require('http');
const logger = require('./logger');
const pairing = require('./pairing');

class WebDashboard {
  constructor() {
    this.server = null;
    this.port = 3000;
    this.metrics = null;
  }

  /**
   * Start web dashboard
   */
  start(port = 3000, metricsProvider = null) {
    this.port = port;
    this.metrics = metricsProvider;

    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    this.server.listen(port, () => {
      logger.info(`🌐 Web dashboard started on http://localhost:${port}`);
    });

    return this.server;
  }

  /**
   * Handle HTTP request
   */
  async handleRequest(req, res) {
    const { pathname, query } = new URL(req.url, `http://${req.headers.host}`);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Routes
    switch (pathname) {
      case '/':
        return this.serveHTML(res);
      
      case '/api/health':
        return this.apiHealth(res);
      
      case '/api/status':
        return this.apiStatus(res);
      
      case '/api/metrics':
        return this.apiMetrics(res);

      case '/api/pairing-code':
        return this.apiPairingCode(res);

      case '/api/about':
        return this.apiAbout(res);

      default:
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
  }

  /**
   * Serve HTML dashboard
   */
  serveHTML(res) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>MULLER BOT Dashboard</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      color: white;
      margin-bottom: 30px;
    }
    h1 { font-size: 2.5em; margin-bottom: 10px; }
    .subtitle { font-size: 0.95em; opacity: 0.9; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .card h2 {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .card .value {
      font-size: 2em;
      font-weight: bold;
      color: #333;
    }
    .status-good { color: #4caf50; }
    .status-bad { color: #f44336; }
    .loading { color: #999; }
    .footer {
      text-align: center;
      color: white;
      margin-top: 30px;
      opacity: 0.8;
    }
    .refresh-button {
      background: white;
      color: #667eea;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 20px;
      width: 100%;
    }
    .refresh-button:hover {
      opacity: 0.9;
    }
    .pairing-card {
      background: white;
      border-radius: 10px;
      padding: 25px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      margin-bottom: 20px;
      text-align: center;
    }
    .pairing-code {
      font-size: 2.8em;
      font-weight: bold;
      letter-spacing: 6px;
      color: #667eea;
      margin: 10px 0;
      font-family: 'Courier New', monospace;
    }
    .pairing-hint {
      color: #666;
      font-size: 0.9em;
    }
    .pairing-connected {
      color: #4caf50;
      font-size: 1.3em;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🤖 MULLER BOT</h1>
      <p class="subtitle">Dashboard & Monitoring</p>
    </header>

    <div class="pairing-card" id="pairingCard">
      <h2 style="color:#666; text-transform:uppercase; font-size:0.9em; letter-spacing:1px;">WhatsApp Pairing</h2>
      <div id="pairingContent">Loading...</div>
    </div>

    <div class="grid">
      <div class="card">
        <h2>Status</h2>
        <div class="value status-good" id="status">Loading...</div>
      </div>

      <div class="card">
        <h2>Messages</h2>
        <div class="value" id="messages">Loading...</div>
      </div>

      <div class="card">
        <h2>Uptime</h2>
        <div class="value" id="uptime">Loading...</div>
      </div>

      <div class="card">
        <h2>Memory</h2>
        <div class="value" id="memory">Loading...</div>
      </div>

      <div class="card">
        <h2>Error Rate</h2>
        <div class="value" id="errors">Loading...</div>
      </div>

      <div class="card">
        <h2>Messages/Min</h2>
        <div class="value" id="rate">Loading...</div>
      </div>
    </div>

    <div class="card">
      <button class="refresh-button" onclick="loadData()">Refresh</button>
    </div>

    <div class="footer">
      <p>Made with ❤️ for Mullerdata</p>
      <p>Auto-refresh every 10 seconds</p>
    </div>
  </div>

  <script>
    async function loadPairingCode() {
      try {
        const response = await fetch('/api/pairing-code');
        const data = await response.json();
        const el = document.getElementById('pairingContent');

        if (data.connected) {
          el.innerHTML = '<div class="pairing-connected">✅ Linked and connected</div>';
        } else if (data.code) {
          el.innerHTML =
            '<div class="pairing-code">' + data.code + '</div>' +
            '<div class="pairing-hint">Enter this in WhatsApp → Linked Devices → Link with phone number. Codes expire quickly — refresh if it doesn\\'t work.</div>';
        } else {
          el.innerHTML = '<div class="pairing-hint">No active pairing code. Waiting for the bot to request one...</div>';
        }
      } catch (error) {
        console.error('Error loading pairing code:', error);
      }
    }

    async function loadData() {
      try {
        loadPairingCode();
        const response = await fetch('/api/metrics');
        const data = await response.json();

        document.getElementById('status').textContent = data.status === 'healthy' ? '✅ Healthy' : '❌ Unhealthy';
        document.getElementById('status').className = data.status === 'healthy' ? 'value status-good' : 'value status-bad';
        
        document.getElementById('messages').textContent = data.messageCount.toLocaleString();
        document.getElementById('uptime').textContent = formatTime(data.uptime);
        document.getElementById('memory').textContent = data.memory.heapUsed;
        document.getElementById('errors').textContent = data.errorRate;
        document.getElementById('rate').textContent = data.messagesPerMinute + ' msg/min';
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }

    function formatTime(seconds) {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return \`\${hrs}h \${mins}m \${secs}s\`;
    }

    // Load on startup
    loadData();

    // Auto-refresh every 10 seconds
    setInterval(loadData, 10000);
  </script>
</body>
</html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  /**
   * API: Health check
   */
  apiHealth(res) {
    const data = this.metrics ? this.metrics.getStatus() : { status: 'unknown' };
    
    res.writeHead(data.status === 'healthy' ? 200 : 503, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(data));
  }

  /**
   * API: Status endpoint
   */
  apiStatus(res) {
    const data = {
      healthy: this.metrics ? this.metrics.isHealthy() : false,
      timestamp: new Date().toISOString(),
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  /**
   * API: Metrics endpoint
   */
  apiMetrics(res) {
    const data = this.metrics ? this.metrics.getMetrics() : { error: 'Metrics unavailable' };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  /**
   * API: Pairing code endpoint
   */
  apiPairingCode(res) {
    const data = pairing.getState();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  /**
   * API: About endpoint
   */
  apiAbout(res) {
    const data = {
      name: 'MULLER BOT',
      version: '1.0.0',
      description: 'Production WhatsApp Bot',
      framework: 'Baileys v7.0.0-rc.14',
      language: 'Node.js',
      endpoints: [
        { path: '/', description: 'Dashboard UI' },
        { path: '/api/health', description: 'Health check' },
        { path: '/api/status', description: 'Status endpoint' },
        { path: '/api/metrics', description: 'Detailed metrics' },
        { path: '/api/about', description: 'About API' },
      ]
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  /**
   * Stop web dashboard
   */
  stop() {
    if (this.server) {
      this.server.close();
      logger.info('🌐 Web dashboard stopped');
    }
  }
}

module.exports = new WebDashboard();
