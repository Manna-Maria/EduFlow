const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
  logout,
} = require("../controllers/authController");

// ===== AUTH ROUTES =====
router.post("/register", register);
router.post("/login", login);
router.get("/me", getCurrentUser);
router.post("/logout", logout);

module.exports = router;
