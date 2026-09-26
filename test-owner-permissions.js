const assert = require('assert');
const path = require('path');

process.env.OWNER_NUMBER = '2347065178640';
process.env.OWNER_LID = '';

const config = require('./config/config');
config.OWNER_NUMBER = '2347065178640';
config.OWNER_LID = '';

const permissions = require('./lib/permissions');

function owner(sender, extra, socket) {
  return permissions.isOwner(sender, extra, socket);
}

async function run() {
  assert.strictEqual(owner('2347065178640@s.whatsapp.net'), true, 'PN JID should be owner');
  assert.strictEqual(owner('2347065178640:12@s.whatsapp.net'), true, 'device-suffixed PN JID should be owner');
  assert.strictEqual(owner('2347065178640@c.us'), true, '@c.us should be owner');
  assert.strictEqual(owner('2347065178640'), true, 'bare number should be owner');
  assert.strictEqual(owner('+2347065178640'), true, 'plus-prefixed number should be owner');

  assert.strictEqual(owner('15551234567@s.whatsapp.net'), false, 'other number is not owner');
  assert.strictEqual(owner('999999999999999@lid'), false, 'unknown LID is not owner');
  assert.strictEqual(owner('1203630@g.us'), false, 'group JID is not owner');

  assert.strictEqual(
    owner('207864236880087@lid', { remoteJidAlt: '2347065178640@s.whatsapp.net' }),
    true,
    'LID with PN alt should be owner'
  );
  assert.strictEqual(
    owner('207864236880087@lid', { participantAlt: '2347065178640@s.whatsapp.net' }),
    true,
    'LID with participantAlt PN should be owner'
  );
  assert.strictEqual(
    owner('207864236880087@lid', { senderPn: '2347065178640@s.whatsapp.net' }),
    true,
    'LID with senderPn should be owner'
  );
  assert.strictEqual(
    owner('207864236880087@lid', { fromMe: true }),
    true,
    'fromMe should always be owner'
  );

  permissions.rememberLidMapping('207864236880087@lid', '2347065178640');
  assert.strictEqual(owner('207864236880087@lid'), true, 'mapped LID should be owner');
  permissions.rememberOwnerJid('207864236880087@lid');
  assert.strictEqual(owner('207864236880087@lid'), true, 'remembered LID should be owner');

  const extraKey = {
    remoteJid: '207864236880087@lid',
    participantAlt: '2347065178640@s.whatsapp.net',
    fromMe: false,
  };
  assert.strictEqual(
    permissions.isOwnerSender(null, extraKey),
    true,
    'isOwnerSender should honor participantAlt'
  );

  const socket = { user: { id: '2347065178640:12@s.whatsapp.net', lid: '111111111111111@lid' } };
  const level = await permissions.checkPermission(
    socket,
    '207864236880087@lid',
    null,
    'OWNER',
    false,
    { senderPn: '2347065178640@s.whatsapp.net' }
  );
  assert.strictEqual(level, permissions.PERMISSION_LEVELS.OWNER, 'checkPermission should grant OWNER');

  const denied = await permissions.checkPermission(
    socket,
    '15551234567@s.whatsapp.net',
    null,
    'OWNER',
    false,
    {}
  );
  assert.strictEqual(denied, permissions.PERMISSION_LEVELS.USER, 'stranger should remain USER');

  const fromMeLevel = await permissions.checkPermission(socket, 'x@lid', null, 'OWNER', true, {});
  assert.strictEqual(fromMeLevel, permissions.PERMISSION_LEVELS.OWNER, 'fromMe grants OWNER');

  const targets = permissions.getOwnerSendJids(socket, ['207864236880087@lid', '1203630@g.us']);
  assert.ok(targets.includes('207864236880087@lid'), 'send targets include preferred LID');
  assert.ok(targets.some((j) => j.includes('2347065178640')), 'send targets include owner phone JID');
  assert.ok(!targets.some((j) => j.endsWith('@g.us')), 'send targets exclude group JIDs');

  const groupKey = {
    remoteJid: '1203630@g.us',
    participant: '207864236880087@lid',
    participantAlt: '2347065178640@s.whatsapp.net',
    fromMe: false,
    id: 'ABC',
  };
  assert.strictEqual(
    owner(groupKey.participant, groupKey),
    true,
    'group LID participant with PN alt is owner'
  );

  const privateKey = {
    remoteJid: '207864236880087@lid',
    fromMe: false,
    id: 'DEF',
    remoteJidAlt: '2347065178640@s.whatsapp.net',
  };
  assert.ok(owner(privateKey.remoteJid, privateKey), 'private LID chat metadata is owner');

  console.log('ALL OWNER PERMISSION TESTS PASSED');
  void path;
}

run().catch((error) => {
  console.error('TEST FAILED:', error);
  process.exit(1);
});
