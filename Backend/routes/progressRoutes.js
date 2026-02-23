const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");

router.get("/:studentId/:courseId", async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const progress = await Progress.findOne({ studentId, courseId });
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
    const { studentId, courseId } = req.body;

    let progress = await Progress.findOne({ studentId, courseId });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    progress.completedLessons += 1;

    progress.percentage =
      (progress.completedLessons / progress.totalLessons) * 100;

    if (progress.percentage >= 100) {
      progress.status = "Completed";
      progress.percentage = 100;
    }

    await progress.save();

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
