const Video = require("../models/Video");
const Course = require("../models/Course");
const Question = require("../models/Question");
const downloadAudioFromYouTube = require("../utils/youtubeAudio");
const { exec } = require("child_process");
const generateMCQs = require("../utils/generateMCQ");

const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// ===== UPLOAD VIDEO =====
exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, courseId, duration, order, module, section, uploadedBy } = req.body;

    // Validate required fields
    if (!title || !courseId || !duration || !uploadedBy) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, courseId, duration, and uploadedBy"
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Handle file upload (in real scenario, this would use multer/AWS S3)
    const videoUrl = req.file ? `/uploads/videos/${req.file.filename}` : req.body.videoUrl;

    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        message: "Video URL or file is required"
      });
    }
// 🔥 NEW PART — Download audio if YouTube link
let audioPath = null;

if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
  try {
    audioPath = await downloadAudioFromYouTube(videoUrl);
    console.log("Audio downloaded at:", audioPath);
  } catch (err) {
    console.log("Audio download failed:", err.message);
  }
}
// 🔥 STEP 3 — Transcribe Audio
// 🔥 STEP 3 — Transcribe Audio Locally
let transcript = "";

if (audioPath) {
  try {
    await new Promise((resolve, reject) => {
      exec(
        `python3 -m whisper "${audioPath}" --model tiny --output_format txt --output_dir uploads/transcripts`,
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout);
          }
        }
      );
    });

    const transcriptFile = audioPath
      .replace("audio", "transcripts")
      .replace(".mp3", ".txt");

    transcript = fs.readFileSync(transcriptFile, "utf-8");

    console.log("Transcript generated locally ✅");

  } catch (err) {
    console.log("Local transcription failed:", err.message);
  }
}
let quizQuestions = [];

if (transcript) {
  try {
    quizQuestions = await generateMCQs(transcript);
    console.log("MCQs generated successfully ✅");
  } catch (err) {
    console.log("MCQ generation failed:", err.message);
  }
}
    // Create video object
    const videoData = {
      title,
      description: description || "",
      courseId,
      videoUrl,
      duration: parseInt(duration),
      order: order ? parseInt(order) : 0,
      module: module || "",
      section: section || "",
      uploadedBy: String(uploadedBy).trim(), // Ensure uploadedBy is a trimmed string
      fileSize: req.file ? req.file.size : null,
      mimeType: req.file ? req.file.mimetype : null,
      transcript,
    };

    const video = new Video(videoData);
    await video.save();

    // Add video to course
    course.videos.push(video._id);
    await course.save();
    // 🔥 SAVE MCQs INTO QUESTION COLLECTION
if (quizQuestions.length > 0) {
  for (let mcq of quizQuestions) {
    await Question.create({
      videoId: video._id,
      questionText: mcq.question,
      options: [
        mcq.options.A,
        mcq.options.B,
        mcq.options.C,
        mcq.options.D
      ],
      correctAnswer: mcq.correctAnswer
    });
  }
}

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== GET ALL VIDEOS =====
exports.getAllVideos = async (req, res) => {
  try {
    const { courseId, isPublished } = req.query;
    let filter = {};

    if (courseId) filter.courseId = courseId;
    if (isPublished !== undefined) filter.isPublished = isPublished === "true";

    const videos = await Video.find(filter)
      .populate("courseId", "title category")
      .populate("uploadedBy", "name email")
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== GET VIDEO BY ID =====
exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate("courseId", "title category duration")
      .populate("uploadedBy", "name email")
      

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== GET VIDEOS BY COURSE =====
exports.getVideosByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const videos = await Video.find({ courseId })
      .populate("uploadedBy", "name email")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== UPDATE VIDEO =====
exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedUpdates = [
      "title",
      "description",
      "duration",
      "thumbnail",
      "order",
      "module",
      "section",
      "isPublished"
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

    const video = await Video.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      data: video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== DELETE VIDEO =====
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    // Remove video reference from course
    await Course.findByIdAndUpdate(
      video.courseId,
      { $pull: { videos: id } }
    );

    res.status(200).json({
      success: true,
      message: "Video deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== REORDER VIDEOS =====
exports.reorderVideos = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { videoOrder } = req.body;

    if (!Array.isArray(videoOrder)) {
      return res.status(400).json({
        success: false,
        message: "videoOrder must be an array of video IDs"
      });
    }

    // Update order for each video
    for (let i = 0; i < videoOrder.length; i++) {
      await Video.findByIdAndUpdate(
        videoOrder[i],
        { order: i },
        { new: true }
      );
    }

    const videos = await Video.find({ courseId }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      message: "Videos reordered successfully",
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== GET VIDEO ANALYTICS =====
exports.getVideoAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    const analytics = {
      videoTitle: video.title,
      viewCount: video.viewCount,
      duration: video.duration,
      courseId: video.courseId,
      uploadedBy: video.uploadedBy,
      createdAt: video.createdAt,
      isPublished: video.isPublished,
      fileSize: video.fileSize
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
