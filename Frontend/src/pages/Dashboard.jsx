import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    overallPercentage: 0,
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const studentId = storedUser?.id;
  const studentName = storedUser?.fullName || "Student";
  useEffect(() => {
  if (!studentId) return;

  const fetchDashboardData = async () => {
      try {
        // Fetch summary statistics
        const summaryRes = await axios.get(
          `http://localhost:5000/api/progress/dashboard/${studentId}`
        );
        setSummary(summaryRes.data);

        // Fetch all courses
        const coursesRes = await axios.get("http://localhost:5000/api/courses");
        
        // Fetch progress for each course
        const courseWithProgress = await Promise.all(
          coursesRes.data.map(async (course) => {
            try {
              const progressRes = await axios.get(
                `http://localhost:5000/api/progress/${studentId}/${course._id}`
              );
              return {
                ...course,
                progress: progressRes.data || {
                  percentage: 0,
                  status: "Not Started",
                  updatedAt: new Date(),
                },
              };
            } catch (err) {
              return {
                ...course,
                progress: {
                  percentage: 0,
                  status: "In Progress",
                  updatedAt: new Date(),
                },
              };
            }
          })
        );

        setCourses(courseWithProgress);
        setLoading(false);
      } catch (err) {
        console.log("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate time ago from timestamp
  const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Get courses by status for analytics
  const completedCount = courses.filter(
    (c) => c.progress.status === "Completed"
  ).length;
  const inProgressCount = courses.filter(
    (c) => c.progress.status === "In Progress"
  ).length;
  const notStartedCount = courses.length - completedCount - inProgressCount;

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
      {/* 1️⃣ WELCOME SECTION */}
      <div className="welcome-section">
        <h1>Welcome, {studentName} 👋</h1>
        <p>Here's your learning progress</p>
      </div>

      {/* 2️⃣ SUMMARY CARDS */}
      <div className="summary-cards">
        <div className="card card-total">
          <div className="card-icon">📚</div>
          <div className="card-content">
            <p className="card-label">Total Courses</p>
            <p className="card-value">{summary.totalCourses}</p>
          </div>
        </div>

        <div className="card card-completed">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <p className="card-label">Completed</p>
            <p className="card-value">{summary.completedCourses}</p>
          </div>
        </div>

        <div className="card card-progress">
          <div className="card-icon">⏳</div>
          <div className="card-content">
            <p className="card-label">In Progress</p>
            <p className="card-value">{summary.inProgressCourses}</p>
          </div>
        </div>

        <div className="card card-percentage">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <p className="card-label">Overall Progress</p>
            <p className="card-value">{summary.overallPercentage}%</p>
          </div>
        </div>
      </div>

      {/* 3️⃣ OVERALL PROGRESS BAR */}
      <div className="overall-progress-section">
        <h2>Your Overall Learning Journey</h2>
        <div className="progress-bar-container">
          <div className="progress-bar-background">
            <div
              className="progress-bar-fill"
              style={{ width: `${summary.overallPercentage}%` }}
            >
              <span className="progress-text">
                {summary.overallPercentage}% Complete
              </span>
            </div>
          </div>
          <div className="progress-indicators">
            <span className="indicator">
              <strong>{summary.completedCourses}</strong> Completed
            </span>
            <span className="indicator">
              <strong>{summary.inProgressCourses}</strong> In Progress
            </span>
          </div>
        </div>
      </div>

      {/* 4️⃣ COURSE-WISE PROGRESS */}
      <div className="courses-section">
        <h2>📚 Your Courses</h2>

        {courses.length === 0 ? (
          <div className="no-courses">
            <p>No courses available yet. Start learning today!</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                {/* Course Header */}
                <div className="course-header">
                  <h3>📘 {course.title}</h3>
                  
                  {/* 5️⃣ COMPLETION BADGE */}
                  {course.progress.status === "Completed" && (
                    <span className="completion-badge">🏆 Completed</span>
                  )}
                  {course.progress.status === "In Progress" && (
                    <span className="progress-badge">⏳ In Progress</span>
                  )}
                  {course.progress.status === "Not Started" && (
                    <span className="not-started-badge">📌 Not Started</span>
                  )}
                </div>

                {/* Course Details */}
                <div className="course-details">
                  <p className="course-category">Category: {course.category}</p>
                  <p className="course-instructor">
                    Instructor: {course.instructor}
                  </p>
                  <p className="course-duration">Duration: {course.duration}h</p>
                </div>

                {/* Progress Bar */}
                <div className="course-progress">
                  <div className="progress-label">
                    <span>Progress</span>
                    <span className="percentage">
                      {course.progress.percentage}%
                    </span>
                  </div>
                  <div className="small-progress-bar">
                    <div
                      className="small-progress-fill"
                      style={{ width: `${course.progress.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status */}
                <div className="course-status">
                  <span className="status-label">Status:</span>
                  <span
                    className={`status-text ${course.progress.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {course.progress.status}
                  </span>
                </div>

                {/* 6️⃣ LAST ACTIVITY */}
                <div className="course-activity">
                  <p className="activity-text">
                    Last Active: {getTimeAgo(course.progress.updatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7️⃣ ANALYTICS SECTION (Optional but Recommended) */}
      <div className="analytics-section">
        <h2>📊 Your Learning Analytics</h2>

        <div className="analytics-grid">
          {/* Pie Chart Representation */}
          <div className="analytics-card">
            <h3>Course Status Distribution</h3>
            <div className="pie-chart-container">
              <div className="pie-chart">
                <div
                  className="pie-slice completed"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background:
                      completedCount > 0
                        ? `conic-gradient(
                      #10b981 0deg ${(completedCount / courses.length) * 360}deg,
                      #f59e0b ${(completedCount / courses.length) * 360}deg ${
                            ((completedCount + inProgressCount) / courses.length) *
                            360
                          }deg,
                      #ef4444 ${((completedCount + inProgressCount) / courses.length) * 360}deg 360deg
                    )`
                        : "#e5e7eb",
                  }}
                ></div>
              </div>
              <div className="pie-legend">
                <div className="legend-item">
                  <span className="legend-color completed"></span>
                  <span>Completed: {completedCount}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color progress"></span>
                  <span>In Progress: {inProgressCount}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color not-started"></span>
                  <span>Not Started: {notStartedCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Courses by Progress */}
          <div className="analytics-card">
            <h3>Top Courses by Progress</h3>
            <div className="top-courses-list">
              {courses
                .sort((a, b) => b.progress.percentage - a.progress.percentage)
                .slice(0, 5)
                .map((course, idx) => (
                  <div key={course._id} className="top-course-item">
                    <span className="rank">#{idx + 1}</span>
                    <span className="course-title">{course.title}</span>
                    <span className="course-percentage">
                      {course.progress.percentage}%
                    </span>
                  </div>
                ))}
              {courses.length === 0 && (
                <p className="no-data">No courses to display</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;