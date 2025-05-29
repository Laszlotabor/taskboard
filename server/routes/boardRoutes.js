const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");

router.use(protect); // Protect all board routes

router.route("/").get(getBoards).post(createBoard);

router.route("/:id").get(getBoardById).put(updateBoard).delete(deleteBoard);

module.exports = router;
