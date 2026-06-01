const express = require("express");
const router = express.Router();
const webhookController = require("../controller/webhookController");

router.post("/clerk", webhookController.handleClerkWebhook);

module.exports = router;