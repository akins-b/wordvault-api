const { Redis } = require('ioredis');

(async () => {
  const url = process.env.REDIS_URL;
  const u = new URL(url);
  console.log('[diag] redis target:', u.protocol, u.hostname, u.port);

  for (const family of [4, 6, 0]) {
    const r = new Redis(url, {
      family,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,   // don't loop, try once
      connectTimeout: 8000,
    });
    r.on('connect', () => console.log(`[diag] family ${family}: connect`));
    r.on('error', (e) => console.log(`[diag] family ${family}: error`, e.code, e.message));
    try {
      console.log(`[diag] family ${family}: PING ->`, await r.ping());
    } catch (e) {
      console.log(`[diag] family ${family}: PING failed:`, e.message);
    }
    r.disconnect();
  }
})();