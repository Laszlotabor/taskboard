const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { moveCard } = require("../controllers/cardController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} = require("../controllers/cardController");

router.use(protect);

router.put("/move/:cardId", authMiddleware, moveCard);


router.route("/:listId").get(getCards);

router.route("/").post(createCard);

router.route("/:id").put(updateCard).delete(deleteCard);

module.exports = router;
