const { Queue } = require("bullmq");
const { queueConnection } = require("./redis");

const emailQueue = new Queue('email-notifications', {
    connection: queueConnection,
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
    connection: queueConnection,
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


emailQueue.on('error', (e) => console.error('[emailQueue]', e.code || e.message));
pushQueue.on('error', (e) => console.error('[pushQueue]', e.code || e.message));

module.exports = {
    emailQueue,
    pushQueue
};