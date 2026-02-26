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

// Get all videos
router.get("/", getAllVideos);

// Get videos by course ID
router.get("/course/:courseId", getVideosByCourse);

// Reorder videos in a course
router.put("/course/:courseId/reorder", reorderVideos);

// Get video analytics
router.get("/:id/analytics", getVideoAnalytics);

// Get a specific video
router.get("/:id", getVideoById);

// Update video
router.put("/:id", updateVideo);

// Delete video
router.delete("/:id", deleteVideo);
module.exports = router;
