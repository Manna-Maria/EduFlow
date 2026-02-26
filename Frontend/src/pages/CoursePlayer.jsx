<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { courseAPI, videoAPI } from "../services/api";
import "./CoursePlayer.css";

const CoursePlayer = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
=======
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const CoursePlayer = () => {
  const { courseId } = useParams(); // get ID from URL

>>>>>>> 69faea9 (backend fixed and mongodb setup done)
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [actualDuration, setActualDuration] = useState(0);

  // Fetch course and videos on component mount
  useEffect(() => {
    fetchCourseAndVideos();
  }, [courseId]);

  const fetchCourseAndVideos = async () => {
    try {
      setLoading(true);
      // Fetch course details
      const courseRes = await courseAPI.getCourseById(courseId);
      setCourse(courseRes.data.data);

      // Fetch videos for this course
      const videosRes = await videoAPI.getVideosByCourse(courseId);
      setVideos(videosRes.data.data);
      
      if (videosRes.data.data.length === 0) {
        setError("No videos uploaded for this course yet.");
      }
    } catch (err) {
      setError("Failed to load course or videos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentVideo = videos[currentVideoIndex];

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const isYoutubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  // When video ends
  const handleVideoEnd = async () => {
    try {
<<<<<<< HEAD
      const res = await videoAPI.getVideoById(currentVideo._id);
      // You can fetch questions related to this video if needed
      // For now, move to next video
      if (currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1);
      } else {
        alert("You've completed all videos in this course!");
      }
=======
      const res = await API.get(`/api/question/${courseId}`);
      setQuestions(res.data.data);
      setShowQuestions(true);
>>>>>>> 69faea9 (backend fixed and mongodb setup done)
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setShowQuestions(false);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setShowQuestions(false);
    }
  };

  const selectVideo = (index) => {
    setCurrentVideoIndex(index);
    setShowQuestions(false);
    setActualDuration(0);
  };

  const handleVideoMetadataLoaded = (e) => {
    // Get actual duration from the video element
    const duration = Math.floor(e.target.duration);
    setActualDuration(duration);
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
<<<<<<< HEAD
      // Validate answers (implement based on your validation endpoint)
      alert("Answers submitted!");
      setShowQuestions(false);
      handleNextVideo();
=======
      const res = await API.post("/api/question/validate", {
        answers: selectedAnswers,
      });

      if (res.data.allCorrect) {
        alert("Correct! You can move to next video.");
        setShowQuestions(false); // hide questions
      } else {
        alert("Some answers are wrong. Try again.");
      }
>>>>>>> 69faea9 (backend fixed and mongodb setup done)
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  if (loading) {
    return <div className="course-player-loading">Loading course...</div>;
  }

  if (error) {
    return <div className="course-player-error">{error}</div>;
  }

  if (!course || videos.length === 0) {
    return <div className="course-player-error">No course or videos found</div>;
  }

  return (
<<<<<<< HEAD
    <div className="course-player">
      <div className="player-header">
        <h1>{course.title}</h1>
        <p className="course-category">{course.category} • {course.level}</p>
      </div>

      <div className="player-container">
        <div className="video-main">
          {currentVideo && (
            <>
              <div className="video-wrapper">
                {isYoutubeUrl(currentVideo.videoUrl) ? (
                  // YouTube Video
                  <iframe
                    key={currentVideo._id}
                    width="100%"
                    height="600"
                    src={`https://www.youtube.com/embed/${getYoutubeVideoId(currentVideo.videoUrl)}?rel=0&modestbranding=1`}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  // Local/External Video File
                  <video
                    key={currentVideo._id}
                    width="100%"
                    controls
                    autoPlay
                    onEnded={handleVideoEnd}
                    onLoadedMetadata={handleVideoMetadataLoaded}
                  >
                    <source
                      src={`http://localhost:5000${currentVideo.videoUrl}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <div className="video-details">
                <h2>{currentVideo.title}</h2>
                <p className="video-description">{currentVideo.description}</p>
                <div className="video-meta">
                  <span>⏱️ Duration: {actualDuration > 0 ? `${Math.floor(actualDuration / 60)}m ${actualDuration % 60}s` : 'Loading...'}</span>
                  <span>👤 Uploaded by: {currentVideo.uploadedBy}</span>
=======
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
>>>>>>> 69faea9 (backend fixed and mongodb setup done)
                </div>

                {currentVideo.module && (
                  <p className="video-module">📚 Module: {currentVideo.module}</p>
                )}

                <div className="video-controls">
                  <button 
                    onClick={handlePreviousVideo} 
                    disabled={currentVideoIndex === 0}
                    className="btn-nav"
                  >
                    ← Previous Video
                  </button>
                  
                  <span className="video-counter">
                    Video {currentVideoIndex + 1} of {videos.length}
                  </span>
                  
                  <button 
                    onClick={handleNextVideo} 
                    disabled={currentVideoIndex === videos.length - 1}
                    className="btn-nav"
                  >
                    Next Video →
                  </button>
                </div>
              </div>

              {showQuestions && (
                <div className="questions-section">
                  <h3>Answer these questions:</h3>
                  {questions.map((q) => (
                    <div key={q._id} className="question-item">
                      <p>{q.questionText}</p>
                      {q.options.map((option, index) => (
                        <div key={index} className="option">
                          <input
                            type="radio"
                            name={q._id}
                            value={option}
                            onChange={() =>
                              handleOptionChange(q._id, option)
                            }
                          />
                          <label>{option}</label>
                        </div>
                      ))}
                    </div>
                  ))}
                  <button onClick={handleSubmit} className="btn-submit">
                    Submit Answers
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="video-playlist">
          <h3>Course Videos ({videos.length})</h3>
          <div className="videos-list">
            {videos.map((video, index) => (
              <div
                key={video._id}
                className={`playlist-item ${index === currentVideoIndex ? 'active' : ''}`}
                onClick={() => selectVideo(index)}
              >
                <div className="playlist-item-number">{index + 1}</div>
                <div className="playlist-item-info">
                  <p className="playlist-item-title">{video.title}</p>
                  <p className="playlist-item-duration">
                    {Math.floor(video.duration / 60)}m {video.duration % 60}s
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;