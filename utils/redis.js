const { Redis } = require('ioredis');

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    family: 0,
    tls: {
        rejectUnauthorized: false
    }
});

/*
redis.on('connect', () => {
    console.log('Connected to Redis');
});
*/

redis.on('error', (err) => {
    if (err.code === 'ECONNRESET') return;
    console.error('Redis error:', err);
});

module.exports = redis;