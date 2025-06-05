const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
  inviteUserToBoard,
} = require("../controllers/boardController");

// Protect all routes in this router
router.use(protect);

router.route("/").get(getBoards).post(createBoard);

router.route("/:id").get(getBoardById).put(updateBoard).delete(deleteBoard);

// Invite user to board (already protected by router.use)
router.post("/:id/invite", inviteUserToBoard);

module.exports = router;
