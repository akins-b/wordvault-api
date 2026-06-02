const express = require("express");
const router = express.Router();
const { getAuth } = require("@clerk/express");
const { validate } = require("../middleware/validate");
const { createEntrySchema, updateEntrySchema } = require("../validators/entryValidator");
const entryController = require("../controller/entryController");

const protect = (req, res, next) => {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    next();
};

router.post("/", protect, validate(createEntrySchema), entryController.createEntry);
router.get("/", protect, entryController.getAllEntries);
router.get("/:id", protect, entryController.getEntryById);
router.put("/:id", protect, validate(updateEntrySchema), entryController.updateEntry);
router.delete("/:id", protect, entryController.deleteEntry);

module.exports = router;