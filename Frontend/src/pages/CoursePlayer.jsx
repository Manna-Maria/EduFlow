import React, { useState, useEffect,useRef} from "react";
import { useParams } from "react-router-dom";
import { courseAPI, videoAPI } from "../services/api";
import "./CoursePlayer.css";
import API from "../services/api";
import YouTube from "react-youtube";

const CoursePlayer = () => {
  const { courseId } = useParams();

  const intervalRef = useRef(null);
  const lastPlayedTimeRef = useRef(0);

  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [actualDuration, setActualDuration] = useState(0);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [videoStartedOnce, setVideoStartedOnce] = useState([]);
  const [player, setPlayer] = useState(null);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [lastPlayedTime, setLastPlayedTime] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  // Get student ID from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const studentId = storedUser?.id;

  // Fetch course and videos on component mount
  useEffect(() => {
    fetchCourseAndVideos();
  }, [courseId]);
  useEffect(() => {
    setShowQuestions(false);
    setSelectedAnswers([]);
    setQuestions([]);
    setWatchedSeconds(0);
    setLastPlayedTime(0);
    lastPlayedTimeRef.current = 0;
    setVideoEnded(false);
  }, [currentVideoIndex]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

  // Update progress in backend when video is started
  const handleVideoStart = async () => {
    if (!studentId || !courseId) {
      console.log("Missing studentId or courseId", { studentId, courseId });
      return;
    }

    if (completedVideos.includes(currentVideoIndex)) {
      return;
    }

    if (videoStartedOnce.includes(currentVideoIndex)) {
      return;
    }

    setVideoStartedOnce((prev) => [...prev, currentVideoIndex]);

    try {
      console.log("Recording start progress for video index:", currentVideoIndex, "videoId:", currentVideo?._id);
      const res = await API.post("/progress/update", {
        studentId,
        courseId,
        videoId: currentVideo?._id,
      });
      console.log("Progress saved successfully on start:", res.data);
    } catch (error) {
      console.error("Error saving progress on start:", error.response?.data || error.message);
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
    console.log("VIDEO ENDED 🔥");
    setVideoEnded(true);

    // Mark this video as completed locally (backend count already incremented on start)
    if (!completedVideos.includes(currentVideoIndex)) {
      setCompletedVideos((prev) => [...prev, currentVideoIndex]);
    }

    try {
      const res = await API.get(`/question/${currentVideo._id}`);
      const fetchedQuestions = res.data.data || [];

      console.log("Fetched questions:", fetchedQuestions);

      if (fetchedQuestions.length === 0) {
        // No quiz → move to next video
        if (currentVideoIndex < videos.length - 1) {
          alert("Video completed. Moving to next video.");
          setCurrentVideoIndex(currentVideoIndex + 1);
        } else {
          alert("Course Completed 🎉");
        }
        return;
      }

      setQuestions(fetchedQuestions.slice(0, 2));
      setShowQuestions(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleNextVideo = () => {
    if (!completedVideos.includes(currentVideoIndex)) {
      alert("Complete the current video and quiz first!");
      return;
    }
  
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setShowQuestions(false);
    }
  };

  const selectVideo = (index) => {
    if (index === currentVideoIndex) return;
  
    if (showQuestions) {
      alert("Complete quiz before moving ahead!");
      return;
    }
  
    const isCompleted = completedVideos.includes(index);
    const isNextUnlocked = index === currentVideoIndex + 1 && completedVideos.includes(currentVideoIndex);
  
    if (!isCompleted && !isNextUnlocked) {
      alert("You must watch videos in order.");
      return;
    }
  
    setCurrentVideoIndex(index);
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
    if (selectedAnswers.length < 2) {
      alert("Please answer both questions.");
      return;
    }
  
    try {
      const res = await API.post("/question/validate", {
        videoId: currentVideo._id,
        answers: selectedAnswers,
      });
  
      if (res.data.allCorrect) {
        alert("Correct! Moving to next video.");

        setShowQuestions(false);
        setSelectedAnswers([]);
        setQuestions([]);

        if (currentVideoIndex < videos.length - 1) {
          setCurrentVideoIndex(currentVideoIndex + 1);
        } else {
          alert("Course Completed 🎉");
        }
      } else {
        alert("Wrong answers! Please watch the same video again.");
  
        setShowQuestions(false);
        setSelectedAnswers([]);
        setQuestions([]);
        setVideoEnded(false);
  
        if (player) {
          lastPlayedTimeRef.current = 0;
          setLastPlayedTime(0);
          player.seekTo(0);
          player.playVideo();
        }
      }
    } catch (error) {
      console.error("Error validating answers:", error);
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
                  <YouTube
  videoId={getYoutubeVideoId(currentVideo.videoUrl)}
  opts={{
    width: "100%",
    height: "600",
    playerVars: {
      autoplay: 1,
      controls: 1,
      disablekb: 0,
      modestbranding: 1,
      rel: 0,
    },
  }}
  onReady={(event) => {
    setPlayer(event.target);
    const duration = Math.floor(event.target.getDuration());
    setActualDuration(duration);
  }}
  onEnd={handleVideoEnd}
  onStateChange={async (event) => {
    if (event.data === 1) {
      await handleVideoStart();

      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        if (!event.target || typeof event.target.getCurrentTime !== "function") {
          clearInterval(intervalRef.current);
          return;
        }

        const currentTime = Math.floor(event.target.getCurrentTime());

        // prevent skipping ahead
        if (currentTime > lastPlayedTimeRef.current + 2) {
          event.target.seekTo(lastPlayedTimeRef.current);
          alert("Skipping is not allowed.");
        } else {
          lastPlayedTimeRef.current = currentTime;
          setLastPlayedTime(currentTime);
          setWatchedSeconds(currentTime);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }}
/>
                ) : (
                  // Local/External Video File
                  <video
                    key={currentVideo._id}
                    width="100%"
                    controls
                    autoPlay
                    onPlay={handleVideoStart}
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
                </div>

                {currentVideo.module && (
                  <p className="video-module">📚 Module: {currentVideo.module}</p>
                )}

<div className="video-controls">
  <button 
    onClick={handlePreviousVideo}
    className="btn-nav"
  >
    ← Previous Video
  </button>
  
  <span className="video-counter">
    Video {currentVideoIndex + 1} of {videos.length}
  </span>
  
  <button 
    onClick={handleNextVideo}
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
                        <label key={index} className="option">
                        <input
                          type="radio"
                          name={q._id}
                          value={option}
                          onChange={() => handleOptionChange(q._id, option)}
                        />
                        <span>{option}</span>
                      </label>
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
              className={`playlist-item 
                ${index === currentVideoIndex ? "active" : ""} 
                ${!completedVideos.includes(index) && index !== currentVideoIndex ? "locked" : ""}`}
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