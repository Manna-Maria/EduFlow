import React, { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const CoursePlayer = () => {
  const { courseId } = useParams(); // get ID from URL

  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  // When video ends
  const handleVideoEnd = async () => {
    try {
      const res = await API.get(`/api/question/${courseId}`);
      setQuestions(res.data.data);
      setShowQuestions(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Store selected answer
  const handleOptionChange = (questionId, option) => {
    setSelectedAnswers((prev) => {
      const filtered = prev.filter(
        (ans) => ans.questionId !== questionId
      );
      return [...filtered, { questionId, selectedOption: option }];
    });
  };

  // Submit answers
  const handleSubmit = async () => {
    try {
      const res = await API.post("/api/question/validate", {
        answers: selectedAnswers,
      });

      if (res.data.allCorrect) {
        alert("Correct! You can move to next video.");
        setShowQuestions(false); // hide questions
      } else {
        alert("Some answers are wrong. Try again.");
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Course Player</h2>

      <video
        width="600"
        controls
        onEnded={handleVideoEnd}
      >
        {/* Replace this with your actual video URL */}
        <source
          src="http://localhost:5000/uploads/sample.mp4"
          type="video/mp4"
        />
      </video>

      {showQuestions && (
        <div style={{ marginTop: "30px" }}>
          <h3>Answer these questions:</h3>

          {questions.map((q) => (
            <div
              key={q._id}
              style={{ marginBottom: "20px" }}
            >
              <p>{q.questionText}</p>

              {q.options.map((option, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    name={q._id}
                    value={option}
                    onChange={() =>
                      handleOptionChange(q._id, option)
                    }
                  />
                  {option}
                </div>
              ))}
            </div>
          ))}

          <button onClick={handleSubmit}>
            Submit Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;