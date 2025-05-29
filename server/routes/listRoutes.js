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

router.route("/:boardId").get(getLists);

router.route("/").post(createList);

router.route("/:id").put(updateList).delete(deleteList);

module.exports = router;
