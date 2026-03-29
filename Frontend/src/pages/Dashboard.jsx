import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Starting to fetch dashboard data for student:", studentId);

      // Fetch all courses
      const coursesRes = await axios.get("http://localhost:5000/api/courses");
      const coursesList = coursesRes.data.data || coursesRes.data; // Handle both response formats
      console.log("Courses fetched:", coursesList);

      // Fetch progress for each course
      const courseWithProgress = await Promise.all(
        coursesList.map(async (course) => {
          try {
            const progressRes = await axios.get(
              `http://localhost:5000/api/progress/${studentId}/${course._id}`
            );
            
            console.log(`Progress for course ${course._id}:`, progressRes.data);

            return {
              ...course,
              progress: progressRes.data || {
                percentage: 0,
                status: "Not Started",
                updatedAt: new Date(),
              },
            };
          } catch (err) {
            console.error(`Error fetching progress for course ${course._id}:`, err);
            return {
              ...course,
              progress: {
                percentage: 0,
                status: "Not Started",
                updatedAt: new Date(),
              },
            };
          }
        })
      );

      console.log("Courses with progress:", courseWithProgress);

      // Filter to only show courses the student has started or is enrolled in
      const enrolledOrStartedCourses = courseWithProgress.filter((course) => {
        const hasStarted = course.progress.percentage > 0;
        const isEnrolled = course.enrolledStudents?.some(
          (student) => student === studentId || student._id === studentId
        );
        return hasStarted || isEnrolled;
      });

      setCourses(enrolledOrStartedCourses);

      // Calculate summary statistics from filtered courses
      const totalCourses = enrolledOrStartedCourses.length;
      const completedCourses = enrolledOrStartedCourses.filter(
        (c) => c.progress.percentage === 100
      ).length;
      const inProgressCourses = enrolledOrStartedCourses.filter(
        (c) => c.progress.percentage > 0 && c.progress.percentage < 100
      ).length;

      // Calculate overall progress across enrolled/started courses
      const overallPercentage =
        totalCourses > 0
          ? Math.round(
              enrolledOrStartedCourses.reduce((sum, c) => sum + c.progress.percentage, 0) /
                totalCourses
            )
          : 0;

      console.log("Summary stats:", {
        totalCourses,
        completedCourses,
        inProgressCourses,
        overallPercentage,
      });

      setSummary({
        totalCourses,
        completedCourses,
        inProgressCourses,
        overallPercentage,
      });

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, [studentId]);

  // Refetch when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log("Visibility changed. Current state:", document.visibilityState);
      if (document.visibilityState === "visible" && studentId) {
        console.log("Dashboard tab is now visible, refreshing data...");
        fetchDashboardData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [studentId]);

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

  const completedCount = courses.filter(
    (c) => c.progress.percentage === 100
  ).length;

  const inProgressCount = courses.filter(
    (c) => c.progress.percentage > 0 && c.progress.percentage < 100
  ).length;

  const notStartedCount = courses.length - completedCount - inProgressCount;

  if (!studentId) {
    return (
      <div className="dashboard-loading">
        <p>Please log in to view your dashboard.</p>
        <button onClick={() => navigate("/login")} style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}>
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <button
          className="burger-btn"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          ☰ Menu
        </button>
      </div>

      {/* MENU */}
      {isMenuOpen && (
        <div
          className="dashboard-menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        >
          <aside
            className="dashboard-side-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="menu-title">☰ Menu</div>

            <button
              className="menu-item"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/dashboard");
              }}
            >
              🏠 Home / Dashboard
            </button>

            <button
              className="menu-item"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/admin/courses");
              }}
            >
              📚 Courses
            </button>

            <button
              className="menu-item"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/profile");
              }}
            >
              👤 Profile
            </button>

            <button
              className="menu-item"
              onClick={() => {
                setIsMenuOpen(false);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
            >
              🚪 Logout
            </button>
          </aside>
        </div>
      )}

      {/* 1️⃣ WELCOME */}
      <div className="welcome-section">
        <h1>Welcome, {studentName} 👋</h1>
        <p>Here's your learning progress</p>
      </div>

      {/* 2️⃣ STATS */}
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

      {/* 3️⃣ YOUR COURSES */}
      <div className="courses-section">
        <h2>📚 Your Courses</h2>

        {courses.length === 0 ? (
          <div className="no-courses">
            <p>No courses available yet. Start learning today!</p>
          </div>
        ) : (
          <div className="courses-grid">

            {courses.map((course) => (
              <div key={course._id} className="course-card-mini">

                <div className="card-header">
                  <h4 className="card-title">{course.title}</h4>
                  {course.progress.percentage === 100 ? (
                    <span className="badge-mini completed">✅</span>
                  ) : course.progress.percentage > 0 ? (
                    <span className="badge-mini in-progress">⏳</span>
                  ) : (
                    <span className="badge-mini not-started">📌</span>
                  )}
                </div>

                <div className="progress-section">
                  <div className="progress-bar-mini">
                    <div
                      className="progress-fill-mini"
                      style={{ width: `${course.progress.percentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-text-mini">{course.progress.percentage}%</span>
                </div>

                <button
                  className="btn-mini"
                  onClick={() => navigate(`/course/${course._id}`)}
                >
                  {course.progress.percentage === 100 ? "Review" : "Continue"} →
                </button>

              </div>
            ))}

          </div>
        )}
      </div>

      {/* 4️⃣ LEARNING PROGRESS */}
      <div className="overall-progress-section">
        <h2>Your Overall Learning Journey</h2>

        <div className="progress-bar-container">

          <div className="progress-bar-background">
            <div
              className="progress-bar-fill"
              style={{ width: `${summary.overallPercentage}%` }}
            ></div>
          </div>

          <p className="progress-text">
            [
            {"█".repeat(Math.floor(summary.overallPercentage / 10))}
            {"░".repeat(10 - Math.floor(summary.overallPercentage / 10))}
            ]{" "}
            {summary.overallPercentage}% Complete
          </p>

        </div>

        <div className="progress-indicators">
          <span className="indicator">
            <strong>{summary.completedCourses}</strong> Completed
          </span>

          <span className="indicator">
            <strong>{summary.inProgressCourses}</strong> In Progress
          </span>

          <span className="indicator">
            <strong>{notStartedCount}</strong> Not Started
          </span>
        </div>

        <div className="progress-stats">
          <p>
            You've completed <strong>{summary.completedCourses}</strong> out of{" "}
            <strong>{summary.totalCourses}</strong> courses.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;