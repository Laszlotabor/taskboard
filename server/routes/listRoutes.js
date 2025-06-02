const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getLists,
  createList,
  updateList,
  deleteList,
} = require("../controllers/listController");

router.use(protect);

// ✅ More specific path to avoid conflict
router.get("/board/:boardId", getLists);

// ✅ List creation
router.post("/", createList);

// ✅ Update or delete specific list
router.route("/:id").put(updateList).delete(deleteList);

module.exports = router;
