const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a course title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"]
    },
    description: {
      type: String,
      required: [true, "Please provide a course description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"]
    },
    category: {
      type: String,
      required: [true, "Please specify a course category"],
      enum: ["Programming", "Design", "Business", "Science", "Math", "Languages", "Other"]
    },
    instructor: {
      type: String,
      required: [true, "Please provide instructor name"]
    },
    instructorEmail: {
      type: String,
      required: [true, "Please provide instructor email"]
    },
    duration: {
      type: Number, // in hours
      required: [true, "Please provide course duration"]
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    thumbnail: {
      type: String, // URL or file path
      default: null
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
    ],
    modules: [
      {
        title: {
          type: String,
          required: true
        },
        description: String,
        sections: [
          {
            title: String,
            items: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
              }
            ]
          }
        ]
      }
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    totalStudents: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: false
    },
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

module.exports = mongoose.model("Course", courseSchema);
