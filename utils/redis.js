const { Redis } = require('ioredis');

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: {
        rejectUnauthorized: false
    }
});

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = redis;