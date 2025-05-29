const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Test protected route
router.get("/me", protect, (req, res) => {
    res.json(req.user);
  });

module.exports = router;
