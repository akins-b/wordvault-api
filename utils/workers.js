const { Worker } = require("bullmq");
const { sendPushNotification } = require("./push");
const { workerConnection } = require("./redis");
const { sendEmail } = require("./email");

// Email Worker
const emailWorker = new Worker('email-notifications', async (job) => {
    const { email, subject, html, username, wordCount } = job.data;

    console.log(`Processing email job ${job.id} for ${email}`);

    await sendEmail(email, subject, html);

    console.log(`Email sent to ${email}`);
}, {
    connection: workerConnection,
    concurrency: 5

});


// push Worker
const pushWorker = new Worker('push-notifications', async (job) => {
    const { subscription, payload } = job.data;

    console.log(`Processing push job ${job.id}`);

    await sendPushNotification(subscription, payload);

    console.log(`Push notification sent`);
}, {
    connection: workerConnection,
    concurrency: 10

});


emailWorker.on('completed', (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Email job ${job.id} failed after ${job.attemptsMade} attempts:`, err.message);
});

pushWorker.on('completed', (job) => {
  console.log(`Push job ${job.id} completed`);
});

pushWorker.on('failed', (job, err) => {
  console.error(`Push job ${job.id} failed:`, err.message);
});

emailWorker.on('error', (e) => console.error('[emailWorker]', e.code || e.message));
pushWorker.on('error', (e) => console.error('[pushWorker]', e.code || e.message));

module.exports = {
    emailWorker,
    pushWorker
};