const MAX_CACHED_MESSAGES = 800;
const cache = new Map();

function cacheKey(key) {
  if (!key?.id) return '';
  return `${key.remoteJid || ''}|${key.id}`;
}

function putMessage(message) {
  const key = cacheKey(message?.key);
  if (!key) return;
  cache.set(key, message);
  if (message.key?.id) cache.set(message.key.id, message);
  while (cache.size > MAX_CACHED_MESSAGES * 2) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
}

function getMessage(key) {
  if (!key) return null;
  const id = cacheKey(key);
  if (id && cache.has(id)) return cache.get(id);
  if (key.id && cache.has(key.id)) return cache.get(key.id);
  return null;
}

module.exports = {
  putMessage,
  getMessage,
};
