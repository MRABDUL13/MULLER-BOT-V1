const { recoverViewOnce, sendOwnerText } = require('../../lib/viewonce');
const { getOwnerSendJids, rememberOwnerJid } = require('../../lib/permissions');

function collectPreferredTargets(ctx) {
  const preferred = [];

  if (ctx.sender && !String(ctx.jid || '').endsWith('@g.us')) {
    preferred.push(ctx.sender);
    preferred.push(ctx.jid);
  } else if (ctx.sender && String(ctx.sender).includes('@')) {
    preferred.push(ctx.sender);
  }

  if (ctx.key?.participantAlt) preferred.push(ctx.key.participantAlt);
  if (ctx.key?.remoteJidAlt && !String(ctx.key.remoteJidAlt).endsWith('@g.us')) {
    preferred.push(ctx.key.remoteJidAlt);
  }
  if (ctx.key?.senderPn) preferred.push(ctx.key.senderPn);
  if (ctx.key?.participantPn) preferred.push(ctx.key.participantPn);

  for (const jid of preferred) rememberOwnerJid(jid);
  return getOwnerSendJids(ctx.socket, preferred);
}

module.exports = {
  name: 'vv2',
  aliases: ['viewonce2', 'view-once2', 'vo2'],
  category: 'media',
  description: 'Recover quoted view-once media and send it to your private chat',
  usage: '.vv2 (reply to a view-once image, video, or audio)',
  permission: 'OWNER',

  async execute(ctx) {
    const targets = collectPreferredTargets(ctx);
    const quoted = ctx.quotedMessage;

    if (!quoted) {
      const sent = await sendOwnerText(
        ctx.socket,
        'Please reply to a view-once image, video, or audio.',
        targets[0]
      );
      if (!sent.ok) {
        await ctx.reply('Please reply to a view-once image, video, or audio.');
      }
      return;
    }

    const result = await recoverViewOnce(ctx.socket, quoted, { targetJid: targets });
    if (!result.ok) {
      const sent = await sendOwnerText(ctx.socket, result.error, targets[0]);
      if (!sent.ok) {
        await ctx.reply(result.error);
      }
    }
  },
};
