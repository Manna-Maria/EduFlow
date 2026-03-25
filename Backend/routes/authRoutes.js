const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  logout,
} = require("../controllers/authController");

// ===== Multer setup for profile pictures =====
const profileUploadsDir = "uploads/profilePictures";
if (!fs.existsSync(profileUploadsDir)) {
  fs.mkdirSync(profileUploadsDir, { recursive: true });
}

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileUploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const profileUpload = multer({
  storage: profileStorage,
  fileFilter: (req, file, cb) => {
    if (!file) {
      cb(null, true);
    } else {
      const allowed = /image\//;
      if (allowed.test(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed"));
      }
    }
  },
});

// ===== AUTH ROUTES =====
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, profileUpload.single("profilePicture"), updateProfile);
router.post("/logout", logout);

module.exports = router;
