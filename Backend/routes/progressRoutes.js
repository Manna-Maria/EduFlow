const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");
const Course = require("../models/Course");
const Video = require("../models/Video");

router.get("/:studentId/:courseId", async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    let progress = await Progress.findOne({ studentId, courseId });
    
    // Get current video count for this course
    const videoCount = await Video.countDocuments({ courseId });
    const totalLessons = videoCount > 0 ? videoCount : 1;
    
    // If no progress exists, create it with current video count
    if (!progress) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      progress = new Progress({
        studentId,
        courseId,
        completedLessons: 0,
        totalLessons: totalLessons,
        percentage: 0,
        status: "In Progress",
      });
      await progress.save();
    } else {
      // Update totalLessons to reflect current video count
      progress.totalLessons = totalLessons;
      progress.percentage = Math.round((progress.completedLessons / progress.totalLessons) * 100);
      if (progress.percentage >= 100) {
        progress.status = "Completed";
        progress.percentage = 100;
      }
      await progress.save();
    }
    
    // Ensure percentage is always a whole number before sending
    progress.percentage = Math.round(progress.percentage);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/dashboard/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const progresses = await Progress.find({ studentId });

    const totalCourses = progresses.length;
    const completedCourses = progresses.filter(
      (p) => p.status === "Completed"
    ).length;

    const inProgressCourses = totalCourses - completedCourses;

    const overallPercentage =
      progresses.reduce((acc, curr) => acc + curr.percentage, 0) /
      totalCourses || 0;

    res.json({
      totalCourses,
      completedCourses,
      inProgressCourses,
      overallPercentage: Math.round(overallPercentage),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/update", async (req, res) => {
  try {
    const { studentId, courseId, videoId } = req.body;

    console.log("Progress update request:", { studentId, courseId, videoId });

    // Get current video count for this course
    const videoCount = await Video.countDocuments({ courseId });
    const totalLessons = videoCount > 0 ? videoCount : 1;
    console.log("Total videos in course:", totalLessons);

    let progress = await Progress.findOne({ studentId, courseId });

    // Auto-create progress if it doesn't exist
    if (!progress) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      progress = new Progress({
        studentId,
        courseId,
        completedLessons: 0,
        totalLessons: totalLessons,
        percentage: 0,
        status: "In Progress",
        completedVideoIds: [],
      });
      console.log("Created new progress record");
    }

    // Ensure completedVideoIds array exists (for old records)
    if (!progress.completedVideoIds) {
      progress.completedVideoIds = [];
    }

    // Check if this video has already been completed
    const videoAlreadyCompleted = videoId && progress.completedVideoIds.some(id => id.toString() === videoId.toString());
    console.log("Video already completed?", videoAlreadyCompleted, "Completed videos:", progress.completedVideoIds);

    // Only increment if it's a new video completion
    if (!videoAlreadyCompleted && progress.completedLessons < totalLessons) {
      progress.completedLessons += 1;
      progress.totalLessons = totalLessons;
      
      if (videoId) {
        progress.completedVideoIds.push(videoId);
      }
      
      progress.percentage = Math.round(
        (progress.completedLessons / progress.totalLessons) * 100
      );

      console.log("Incrementing progress:", {
        completedLessons: progress.completedLessons,
        totalLessons: progress.totalLessons,
        percentage: progress.percentage
      });

      if (progress.percentage >= 100) {
        progress.status = "Completed";
        progress.percentage = 100;
      }

      await progress.save();
    } else {
      // Already complete or video already watched, recalculate percentage
      progress.totalLessons = totalLessons;
      progress.percentage = Math.round(
        (progress.completedLessons / progress.totalLessons) * 100
      );
      if (progress.percentage >= 100) {
        progress.status = "Completed";
        progress.percentage = 100;
      }
      console.log("Not incrementing - already watched or complete. Current:", {
        completedLessons: progress.completedLessons,
        totalLessons: progress.totalLessons,
        percentage: progress.percentage
      });
      await progress.save();
    }

    // Ensure percentage is always a whole number before sending
    progress.percentage = Math.round(progress.percentage);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset progress for a student (for testing/development)
router.post("/reset/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("Resetting all progress for student:", studentId);
    
    const result = await Progress.deleteMany({ studentId });
    console.log("Deleted progress records:", result.deletedCount);
    
    res.json({ 
      message: "All progress records reset to 0 for student", 
      studentId,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset progress by email (easier for testing)
router.post("/reset-by-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    console.log("Resetting all progress for email:", email);
    
    const User = require("../models/User");
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const result = await Progress.deleteMany({ studentId: user._id });
    console.log("Deleted progress records:", result.deletedCount);
    
    res.json({ 
      message: "All progress records reset to 0", 
      email,
      studentId: user._id,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
