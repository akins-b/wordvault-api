const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect"); 
const { validate } = require("../middleware/validate");
const { createEntrySchema, updateEntrySchema } = require("../validators/entryValidator");
const entryController = require("../controller/entryController");

router.post("/", protect, validate(createEntrySchema), entryController.createEntry);
router.post('/lookup', protect, entryController.lookupEntry);
router.get("/", protect, entryController.getAllEntries);
router.get("/:id", protect, entryController.getEntryById);
router.put("/:id", protect, validate(updateEntrySchema), entryController.updateEntry);
router.delete("/:id", protect, entryController.deleteEntry);

module.exports = router;