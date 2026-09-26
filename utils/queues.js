const { Queue } = require("bullmq");
const redis = require("./redis");

const emailQueue = new Queue('email-notifications', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000
        },
        removeOnComplete: 100,
        removeOnFail: 50
    }
});

const pushQueue = new Queue('push-notifications', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 3000
        },
        removeOnComplete: 100,
        removeOnFail: 50
    }
});

module.exports = {
    emailQueue,
    pushQueue
};