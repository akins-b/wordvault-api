// redis.js
const { Redis } = require('ioredis');

function createRedis(name, opts = {}) {
  const client = new Redis(process.env.REDIS_URL, {
    family: 4,
    keepAlive: 10000,
    retryStrategy: (times) => Math.min(times * 200, 3000),
    ...opts,
  });

  client.on('ready', () => console.log(`[redis:${name}] ready`));
  client.on('error', (err) => console.error(`[redis:${name}] error:`, err.code, err.message));

  return client;
}

const workerConnection = createRedis('worker', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const queueConnection = createRedis('queue', { maxRetriesPerRequest: 3 });

module.exports = { workerConnection, queueConnection };