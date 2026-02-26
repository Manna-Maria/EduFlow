const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addModule,
  getCourseStats
} = require("../controllers/courseController");

// ===== COURSE ROUTES =====

// Create a new course
router.post("/", createCourse);

// Get all courses with filters
router.get("/", getAllCourses);

// Get course statistics
router.get("/:id/stats", getCourseStats);

// Get a specific course by ID
router.get("/:id", getCourseById);

// Update a course
router.put("/:id", updateCourse);

// Delete a course
router.delete("/:id", deleteCourse);

// Add a module to a course
router.post("/:id/modules", addModule);

module.exports = router;
