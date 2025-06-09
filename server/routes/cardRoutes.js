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

router.put("/move/:cardId", moveCard);

router.route("/:listId").get(getCards);

router.route("/").post(upload.single("image"), createCard);

router.route("/:id").put(upload.single("image"), updateCard).delete(deleteCard);

module.exports = router;
