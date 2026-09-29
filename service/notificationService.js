const prisma = require('../db');
const { emailQueue, pushQueue } = require('../utils/queues');

async function sendWeeklySummary() {
  console.log('[DEBUG] Starting weekly summary generation on live server...');
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  console.time('findMany');
  const users = await prisma.user.findMany({
    include: {
      pushSubscriptions: true,
      entries: {
        where: {
          createdAt: { gte: oneWeekAgo }
        }
      }
    }
  });
  console.timeEnd('findMany');
  console.log(`[weekly] ${users.length} users loaded`);


  let emailJobsAdded = 0;
  let pushJobsAdded = 0;

  for (const user of users) {
    if (user.entries.length === 0) continue;


    const wordList = user.entries.map(e => `• ${e.text} — ${e.definition}`).join('\n');
    const masteredCount = user.entries.filter(e => e.mastered).length;

    if (user.weeklyEmailEnabled) {
      console.log(`[weekly] adding email job for user ${user.id}...`);
      await emailQueue.add(`email-${user.id}`, {
        email: user.email,
        subject: `Your weekly word summary`,
        html: `
          <h2>Hi ${user.firstName || 'there'}! Here's your week in words</h2>
          <p>You learned <strong>${user.entries.length} new word${user.entries.length === 1 ? '' : 's'}</strong> this week!</p>
          <p>Mastered: <strong>${masteredCount}</strong></p>
          <h3>Your new word${user.entries.length === 1 ? '' : 's'}:</h3>
          <ul>
            ${user.entries.map(e => `
              <li>
                <strong>${e.text}</strong> — ${e.definition}
                ${e.example ? `<br><br><em>"${e.example}"</em>` : ''}
              </li>
            `).join('')}
          </ul>
          <p>Keep it up!</p>
        `
      });

      console.log(`[weekly] email job added for user ${user.id}`);

      emailJobsAdded++;
    }
    
    // add push jobs to queue
    if (user.pushEnabled) {
      for (const subscription of user.pushSubscriptions) {
        await pushQueue.add(`push-${user.id}-${subscription.id}`, {
          subscription,
          payload: {
            title: 'Your weekly word summary',
            body: `You learned ${user.entries.length} new word${user.entries.length === 1 ? '' : 's'} this week! Check your email for details.`,
            icon: '/icons/icon-192.png'
          }
        });
        pushJobsAdded++;
      }
    }
  }

  console.log(`Queued ${emailJobsAdded} emails and ${pushJobsAdded} push notifications`);
}

module.exports = { sendWeeklySummary };