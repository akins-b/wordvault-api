const prisma = require('../db');
const { sendPushNotification } = require('../utils/push');
const { sendEmail } = require('../utils/email');

async function sendWeeklySummary() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);


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

  for (const user of users) {
    if (user.entries.length === 0) continue;

    const wordList = user.entries.map(e => `• ${e.text} — ${e.definition}`).join('\n');
    const masteredCount = user.entries.filter(e => e.mastered).length;

    await sendEmail(
      user.email,
      `Your weekly word summary`,
      `
        <h2>Hi ${user.username}! Here's your week in words</h2>
        <p>You learned <strong>${user.entries.length} new words</strong> this week!</p>
        <p>Mastered: <strong>${masteredCount}</strong></p>
        <h3>Your new words:</h3>
        <ul>
          ${user.entries.map(e => `
            <li>
              <strong>${e.text}</strong> — ${e.definition}
              ${e.example ? `<br><em>"${e.example}"</em>` : ''}
            </li>
          `).join('')}
        </ul>
        <p>Keep it up!</p>
      `
    );

    for (const subscription of user.pushSubscriptions) {
      await sendPushNotification(subscription, {
        title: 'Your weekly word summary',
        body: `You learned ${user.entries.length} new words this week! Check your email for details.`,
        icon: '/icon.png'
      });
    }
  }

  console.log(`Weekly summary sent to ${users.length} users`);
}

module.exports = { sendWeeklySummary };