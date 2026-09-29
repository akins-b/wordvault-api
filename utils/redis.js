// redis.js
const { Redis } = require('ioredis');

function createRedis(name, opts = {}) {
  const client = new Redis(process.env.REDIS_URL, {
    family: 0,
    tls: { rejectUnauthorized: false },
    keepAlive: 10000, // TCP keepalive so idle sockets aren't silently dropped
    retryStrategy: (times) => Math.min(times * 200, 3000),
    ...opts,
  });

  client.on('error', (err) => console.error(`[redis:${name}] error:`, err.code || err.message));
  client.on('ready', () => console.log(`[redis:${name}] ready`));
  client.on('close', () => console.log(`[redis:${name}] closed`));
  client.on('reconnecting', () => console.log(`[redis:${name}] reconnecting`));
  return client;
}

const workerConnection = createRedis('worker', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const queueConnection = createRedis('queue', { maxRetriesPerRequest: 3 });

module.exports = { workerConnection, queueConnection };