const cron = require('node-cron');
const { sendWeeklySummary } = require('../service/notificationService');

function startScheduler() {
  cron.schedule('0 18 * * 0', async () => {
    console.log(' Running weekly summary...');
    try {
      await sendWeeklySummary();
    } catch (error) {
      console.error('Error in weekly summary:', error);
    }
  }, {
    timezone: 'Africa/Lagos'
  });

  console.log(`Scheduler started`);
}

module.exports = { startScheduler };