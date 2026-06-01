const express = require("express");
const router = express.Router();
const { getAuth } = require("@clerk/express");
const userController = require("../controller/userController");

const protect = (req, res, next) => {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    next();
};

router.get("/:id", protect, userController.getUserById);

module.exports = router;