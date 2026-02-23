const express = require("express");
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

// ===== VIDEO ROUTES =====

// Upload a new video
router.post("/", uploadVideo);

// Get all videos with filters
router.get("/", getAllVideos);

// Get a specific video by ID (with view count increment)
router.get("/:id", getVideoById);

// Get videos by course ID
router.get("/course/:courseId", getVideosByCourse);

// Get video analytics
router.get("/:id/analytics", getVideoAnalytics);

// Update a video
router.put("/:id", updateVideo);

// Reorder videos in a course
router.put("/course/:courseId/reorder", reorderVideos);

// Delete a video
router.delete("/:id", deleteVideo);

module.exports = router;
