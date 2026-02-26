const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const {
  uploadVideo,
  getAllVideos,
  getVideoById,
  getVideosByCourse,
  updateVideo,
  deleteVideo,
  reorderVideos,
  getVideoAnalytics
} = require("../controllers/videoController");

// ===== Multer Configuration for Video Uploads =====
const uploadsDir = "uploads/videos";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file) {
      const allowedTypes = /video\//;
      const mimetype = allowedTypes.test(file.mimetype);
      if (mimetype) {
        return cb(null, true);
      } else {
        cb(new Error("Only video files are allowed"));
      }
    } else {
      cb(null, true);
    }
  }
});

// ===== VIDEO ROUTES =====

// Upload a new video (only POST requests)
router.post("/", upload.single("video"), uploadVideo);

// Get videos by course ID (more specific)
router.get("/course/:courseId", getVideosByCourse);

// Reorder videos in a course (more specific)
router.put("/course/:courseId/reorder", reorderVideos);

// Get video analytics (more specific)
router.get("/:id/analytics", getVideoAnalytics);

// Get a specific video
router.get("/:id", getVideoById);

// Update video
router.put("/:id", updateVideo);

// Delete video
router.delete("/:id", deleteVideo);

// Get all videos (least specific)
router.get("/", getAllVideos);
module.exports = router;
