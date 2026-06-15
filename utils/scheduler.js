const cron = require('node-cron');
const { sendWeeklySummary } = require('../service/notificationService');

function startScheduler() {
  cron.schedule('0 18 * * 0', async () => {
    console.log(' Running weekly summary...');
    await sendWeeklySummary();
  }, {
    timezone: 'Africa/Lagos'
  });

  console.log(`Scheduler started`);
}

module.exports = { startScheduler };