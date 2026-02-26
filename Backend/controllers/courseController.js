const Course = require("../models/Course");
const Video = require("../models/Video");

// ===== CREATE COURSE =====
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, instructor, instructorEmail, duration, level, thumbnail } = req.body;

    // Validate required fields
    if (!title || !description || !category || !instructor || !instructorEmail || !duration) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Create new course
    const course = new Course({
      title,
      description,
      category,
      instructor,
      instructorEmail,
      duration,
      level: level || "Beginner",
      thumbnail: thumbnail || null
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== GET ALL COURSES =====
exports.getAllCourses = async (req, res) => {
  try {
    const { category, level, isPublished } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (isPublished !== undefined) filter.isPublished = isPublished === "true";

    const courses = await Course.find(filter)
      .populate("videos")
      .populate("enrolledStudents", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== GET COURSE BY ID =====
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate({
        path: "videos",
        select: "title description duration thumbnail order module section"
      })
      .populate("enrolledStudents", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== UPDATE COURSE =====
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate update data
    const allowedUpdates = [
      "title",
      "description",
      "category",
      "instructor",
      "instructorEmail",
      "duration",
      "level",
      "thumbnail",
      "isPublished",
      "rating"
    ];

    const isValidUpdate = Object.keys(updates).every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValidUpdate) {
      return res.status(400).json({
        success: false,
        message: "Invalid update fields"
      });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== DELETE COURSE =====
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Delete all videos associated with the course
    await Video.deleteMany({ courseId: id });

    res.status(200).json({
      success: true,
      message: "Course and associated videos deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== ADD MODULE TO COURSE =====
exports.addModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Module title is required"
      });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      {
        $push: {
          modules: {
            title,
            description: description || "",
            sections: []
          }
        },
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Module added successfully",
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== GET COURSE STATISTICS =====
exports.getCourseStats = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const videoCount = await Video.countDocuments({ courseId: id });

    const stats = {
      courseTitle: course.title,
      totalVideos: videoCount,
      totalStudents: course.totalStudents,
      rating: course.rating,
      totalDuration: course.duration,
      enrolledStudents: course.enrolledStudents.length,
      isPublished: course.isPublished
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
