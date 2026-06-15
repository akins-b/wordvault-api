const webpush = require('web-push');

webpush.setVapidDetails(
  process.env.VAPID_MAILTO,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function sendPushNotification(subscription, payload) {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth
        }
      },
      JSON.stringify(payload)
    );
  } catch (error) {
    if (error.statusCode === 410) {
      await prisma.pushSubscription.delete({
        where: { endpoint: subscription.endpoint }
      });
    }
  }
}

module.exports = { sendPushNotification };