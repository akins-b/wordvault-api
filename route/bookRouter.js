const express = require("express");
const router = express.Router();
const { getAuth } = require("@clerk/express");

const { validate } = require("../middleware/validate");
const { createBookSchema, updateBookSchema } = require("../validators/bookValidator");
const bookController = require("../controller/bookController");

const protect = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

router.post("/", protect, validate(createBookSchema), bookController.createBook);
router.get("/", protect, bookController.getAllBooks);
router.get("/:id", protect, bookController.getBookById);
router.put("/:id", protect, validate(updateBookSchema), bookController.updateBook);
router.delete("/:id", protect, bookController.deleteBook);

module.exports = router;