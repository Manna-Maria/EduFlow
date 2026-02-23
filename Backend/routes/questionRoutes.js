const express = require("express");
const router = express.Router();

const {
  addQuestion,
  getQuestionsByVideo,
  validateAnswers
} = require("../controllers/questionController");

router.post("/add", addQuestion);
router.get("/:videoId", getQuestionsByVideo);
router.post("/validate", validateAnswers);

module.exports = router;