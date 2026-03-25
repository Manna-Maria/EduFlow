const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addModule,
  getCourseStats,
  enrollCourse,        // ✅ ADD
  completeCourse
} = require("../controllers/courseController");

// ===== COURSE ROUTES =====

// Create a new course
router.post("/", createCourse);

// Get course statistics (more specific)
router.get("/:id/stats", getCourseStats);

// Add a module to a course (more specific)
router.post("/:id/modules", addModule);
// ===== ENROLL & COMPLETE =====
router.post("/:id/enroll", enrollCourse);
const { protect } = require("../middleware/authMiddleware");

router.post("/:id/complete", protect, completeCourse);
// Get a specific course by ID
router.get("/:id", getCourseById);

// Update a course
router.put("/:id", updateCourse);

// Delete a course
router.delete("/:id", deleteCourse);

// Get all courses with filters (least specific)
router.get("/", getAllCourses);

module.exports = router;
