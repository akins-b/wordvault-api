const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/protect");
const prisma = require('../db');


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

module.exports = router;