import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI, videoAPI } from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalVideos: 0,
    totalStudents: 0,
    publishedCourses: 0
  });

  const [recentCourses, setRecentCourses] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all courses
      const coursesResponse = await courseAPI.getAllCourses();
      const allCourses = coursesResponse.data.data;

      // Fetch all videos
      const videosResponse = await videoAPI.getAllVideos();
      const allVideos = videosResponse.data.data;

      // Calculate stats
      const totalStudents = allCourses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0);
      const publishedCourses = allCourses.filter((course) => course.isPublished).length;

      setStats({
        totalCourses: allCourses.length,
        totalVideos: allVideos.length,
        totalStudents,
        publishedCourses
      });

      // Get recent courses (last 5)
      setRecentCourses(allCourses.slice(0, 5));

      // Get recent videos (last 5)
      setRecentVideos(allVideos.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">Manage courses, videos, and track student engagement</p>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon="📚"
          color="blue"
        />
        <StatCard
          title="Total Videos"
          value={stats.totalVideos}
          icon="🎥"
          color="purple"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="👥"
          color="green"
        />
        <StatCard
          title="Published Courses"
          value={stats.publishedCourses}
          icon="✅"
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button
          className="action-btn"
          onClick={() => navigate('/admin/courses/create')}
        >
          <span className="action-icon">+</span>
          Create Course
        </button>
        <button
          className="action-btn"
          onClick={() => navigate('/admin/videos/upload')}
        >
          <span className="action-icon">📤</span>
          Upload Video
        </button>
        <button
          className="action-btn"
          onClick={() => navigate('/admin/courses')}
        >
          <span className="action-icon">📋</span>
          Manage Courses
        </button>
      </div>

      {/* Recent Courses */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Courses</h2>
          <button
            className="view-all-link"
            onClick={() => navigate('/admin/courses')}
          >
            View All →
          </button>
        </div>

        {recentCourses.length === 0 ? (
          <p className="empty-message">No courses yet</p>
        ) : (
          <div className="recent-items">
            {recentCourses.map((course) => (
              <div
                key={course._id}
                className="recent-item"
                onClick={() => navigate(`/admin/courses/${course._id}`)}
              >
                <div className="item-thumbnail">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} />
                  ) : (
                    <div className="placeholder">{course.title.charAt(0)}</div>
                  )}
                </div>
                <div className="item-details">
                  <h3>{course.title}</h3>
                  <p>{course.instructor}</p>
                  <div className="item-stats">
                    <span>{course.videos?.length || 0} videos</span>
                    <span>{course.enrolledStudents?.length || 0} students</span>
                  </div>
                </div>
                <span className={`item-status ${course.isPublished ? 'published' : 'draft'}`}>
                  {course.isPublished ? '✓ Published' : '⊘ Draft'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Videos */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Videos</h2>
          <button
            className="view-all-link"
            onClick={() => navigate('/admin/videos')}
          >
            View All →
          </button>
        </div>

        {recentVideos.length === 0 ? (
          <p className="empty-message">No videos yet</p>
        ) : (
          <div className="recent-items">
            {recentVideos.map((video) => (
              <div
                key={video._id}
                className="recent-item"
                onClick={() => navigate(`/admin/videos/${video._id}`)}
              >
                <div className="item-thumbnail">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} />
                  ) : (
                    <div className="placeholder">🎥</div>
                  )}
                </div>
                <div className="item-details">
                  <h3>{video.title}</h3>
                  <p>{video.courseId?.title || 'No course'}</p>
                  <div className="item-stats">
                    <span>{Math.floor(video.duration / 60)} min</span>
                    <span>{video.viewCount} views</span>
                  </div>
                </div>
                <span className={`item-status ${video.isPublished ? 'published' : 'draft'}`}>
                  {video.isPublished ? '✓ Published' : '⊘ Draft'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
