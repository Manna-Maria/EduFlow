const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  completedLessons: {
    type: Number,
    default: 0,
  },
  totalLessons: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["In Progress", "Completed"],
    default: "In Progress",
  },
}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);