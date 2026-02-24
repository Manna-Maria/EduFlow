const Question = require("../models/Question");

// Add question (Admin use)
exports.addQuestion = async (req, res) => {
  try {
    const { videoId, questionText, options, correctAnswer } = req.body;

    const question = new Question({
      videoId,
      questionText,
      options,
      correctAnswer
    });

    await question.save();

    res.status(201).json({
      success: true,
      message: "Question added successfully",
      data: question
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get questions for a video
exports.getQuestionsByVideo = async (req, res) => {
  try {
    const questions = await Question.find({
      videoId: req.params.videoId
    }).select("-correctAnswer"); // Hide correct answer

    res.json({ success: true, data: questions });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Validate answers
const Question = require("../models/Question");

// Add question (Admin use)
exports.addQuestion = async (req, res) => {
  try {
    const { videoId, questionText, options, correctAnswer } = req.body;

    const question = new Question({
      videoId,
      questionText,
      options,
      correctAnswer
    });

    await question.save();

    res.status(201).json({
      success: true,
      message: "Question added successfully",
      data: question
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get questions for a video
exports.getQuestionsByVideo = async (req, res) => {
  try {
    const questions = await Question.find({
      videoId: req.params.videoId
    }).select("-correctAnswer"); // Hide correct answer

    res.json({ success: true, data: questions });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Validate answers
exports.validateAnswers = async (req, res) => {
  try {
    const { answers } = req.body;
    // answers = [{ questionId, selectedOption }]

    let allCorrect = true;

    for (let ans of answers) {
      const question = await Question.findById(ans.questionId);

      if (!question || question.correctAnswer !== ans.selectedOption) {
        allCorrect = false;
        break;
      }
    }

    res.json({
      success: true,
      allCorrect
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};