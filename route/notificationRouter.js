const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/protect");
const prisma = require('../db');
const { sendWeeklySummary } = require('../service/notificationService');


router.post('/subscribe', protect, async (req, res) => {
  try {
    const userId  = req.headers['x-user-id'];
    const { endpoint, keys } = req.body;

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth, userId },
      create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userId }
    });

    res.json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/trigger-weekly-summary', (req, res) => {
  try {
    // Run this asynchronously in the background so the request doesn't timeout
    sendWeeklySummary().catch(console.error);
    res.json({ message: 'Weekly summary generation started in the background' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;