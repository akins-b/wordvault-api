const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect"); 
const userController = require("../controller/userController");

router.get('/stats', protect, userController.getStats);
router.get("/:id", protect, userController.getUserById);

module.exports = router;