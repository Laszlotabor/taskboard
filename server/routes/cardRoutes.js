const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // multer upload middleware

const {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
} = require("../controllers/cardController");

router.use(protect);

// ✅ Distinct route to avoid param conflict
router.get("/list/:listId", getCards);

// ✅ Create a new card with image upload
router.post("/", upload.single("image"), createCard);

// ✅ Update or delete card by ID
router
  .route("/:id")
  .put(upload.single("image"), updateCard)
  .delete(deleteCard);

// ✅ Move card endpoint
router.put("/move/:cardId", moveCard);

module.exports = router;
