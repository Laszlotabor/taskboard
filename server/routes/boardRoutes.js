const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const boardPermission = require("../middleware/permissionMiddleWare");

const {
  getBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
  inviteUserToBoard,
} = require("../controllers/boardController");

// Protect all routes with authentication
router.use(protect);

// Public routes for boards belonging to user or invited
router.route("/").get(getBoards).post(createBoard);

// Add boardPermission middleware to routes that modify a board or invite users
router
  .route("/:id")
  .get(getBoardById)
  .put(boardPermission, updateBoard)
  .delete(boardPermission, deleteBoard);

router.post("/:id/invite", boardPermission, inviteUserToBoard);

module.exports = router;
