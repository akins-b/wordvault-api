require('dotenv').config();
const { sendWeeklySummary } = require('../service/notificationService');
const prisma = require('../db');

async function test() {
  try {
    console.log("Triggering weekly summary test...");
    const users = await prisma.user.findMany({ include: { entries: true } });
    console.log("Users in DB:", users.map(u => ({ email: u.email, entryCount: u.entries.length })));
    await sendWeeklySummary();
    console.log("Done.");
  } catch (err) {
    console.error("Error during test:", err);
  } finally {
    process.exit(0);
  }
}

test();
