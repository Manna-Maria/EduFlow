const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a video title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"]
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot be more than 1000 characters"]
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Video must belong to a course"]
    },
    videoUrl: {
      type: String,
      required: [true, "Please provide video URL"]
    },
    duration: {
      type: Number, // in seconds
      required: [true, "Please provide video duration"]
    },
    thumbnail: {
      type: String, // URL or file path
      default: null
    },
    uploadedBy: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true,
      default: 0
    },
    module: {
      type: String,
      required: false
    },
    section: {
      type: String,
      required: false
    },
    fileSize: {
      type: Number, // in bytes
      required: false
    },
    mimeType: {
      type: String,
      required: false
    },
    viewCount: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    quiz: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
