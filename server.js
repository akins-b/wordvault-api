require('dotenv').config();
require("./scripts/test-redis");
const express = require('express');
const app = express();
const port = process.env.PORT || 3006;
const { clerkMiddleware } = require("@clerk/express");

const userRoutes = require("./route/userRouter");
const entryRoutes = require("./route/entryRouter");
const bookRoutes = require("./route/bookRouter");
const webhookRoutes = require("./route/webhookRouter");
const notificationRoutes = require('./route/notificationRouter');
const authRoutes = require('./route/authRouter');
const { startScheduler } = require('./utils/scheduler');
const cors = require('cors');

require('./utils/workers');
console.log("Notification workers started");

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

startScheduler();

app.use("/webhooks/clerk", express.raw({ type: "application/json" }));
app.use("/webhooks", webhookRoutes);

app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use("/user", userRoutes);
app.use("/entry", entryRoutes);
app.use("/book", bookRoutes);
app.use('/notifications', notificationRoutes);

app.get("/health-check", (req, res) => {
    res.status(200).json({ message: "WordVault server is running!" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});