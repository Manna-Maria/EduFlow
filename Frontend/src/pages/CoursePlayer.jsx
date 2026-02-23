import React, { useState } from "react";
import API from "../services/api";

const CoursePlayer = ({ videoId, videoUrl }) => {
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  // When video ends
  const handleVideoEnd = async () => {
    try {
      const res = await API.get(`/question/${videoId}`);
      setQuestions(res.data.data);
      setShowQuestions(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Store selected answer
  const handleOptionChange = (questionId, option) => {
    setSelectedAnswers(prev => {
      const filtered = prev.filter(ans => ans.questionId !== questionId);
      return [...filtered, { questionId, selectedOption: option }];
    });
  };

  // Submit answers
  const handleSubmit = async () => {
    try {
      const res = await API.post("/question/validate", {
        answers: selectedAnswers
      });

      if (res.data.allCorrect) {
        alert("Correct! You can move to next video.");
      } else {
        alert("Some answers are wrong. Try again.");
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Course Player</h2>

      <video
        width="600"
        controls
        onEnded={handleVideoEnd}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {showQuestions && (
        <div>
          <h3>Answer these questions:</h3>

          {questions.map(q => (
            <div key={q._id} style={{ marginBottom: "20px" }}>
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