require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3005;
const { clerkMiddleware } = require("@clerk/express");

const userRoutes = require("./route/userRouter");
const entryRoutes = require("./route/entryRouter");
const bookRoutes = require("./route/bookRouter");
const webhookRoutes = require("./route/webhookRouter");

app.use(clerkMiddleware());

app.use("/webhooks/clerk", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/webhooks", webhookRoutes);
app.use("/user", userRoutes);
app.use("/entry", entryRoutes);
app.use("/book", bookRoutes);

//health check endpoint
app.get("/health-check", (req, res) => {
    res.status(200).json({message: "WordVault server is running!"});
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});