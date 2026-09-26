const healthcheck = require('../../lib/healthcheck');
const { boxMessage, formatTime } = require('../../lib/utils');

module.exports = {
  name: 'stats',
  aliases: ['status', 'metrics'],
  category: 'owner',
  description: 'Display bot statistics and metrics',
  usage: '.stats',
  permission: 'OWNER',

  async execute(ctx) {
    try {
      const metrics = healthcheck.getMetrics();
      
      const response = boxMessage(
        '📊 BOT STATISTICS',
        '',
        '🔌 CONNECTION',
        `Status: ${metrics.connectionStatus.toUpperCase()}`,
        `Uptime: ${formatTime(metrics.uptime)}`,
        '',
        '📈 MESSAGES',
        `Total: ${metrics.messageCount}`,
        `Rate: ${metrics.messagesPerMinute} msg/min`,
        `Errors: ${metrics.errorCount} (${metrics.errorRate})`,
        '',
        '💾 MEMORY',
        `Heap: ${metrics.memory.heapUsed} / ${metrics.memory.heapTotal}`,
        `RSS: ${metrics.memory.rss}`,
        '',
        '⚠️  HEALTH STATUS',
        metrics.status === 'healthy' ? '✅ HEALTHY' : '❌ UNHEALTHY'
      );

      await ctx.reply(response);
    } catch (error) {
      await ctx.reply('❌ Failed to get statistics');
    }
  }
};
