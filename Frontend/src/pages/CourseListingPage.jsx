import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import './CourseListingPage.css';

export default function CourseListingPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const categories = ['Programming', 'Design', 'Business', 'Science', 'Math', 'Languages', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses when search or filters change
  useEffect(() => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((course) => course.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel) {
      filtered = filtered.filter((course) => course.level === selectedLevel);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedCategory, selectedLevel]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAllCourses();
      setCourses(response.data.data);
      setMessage({ type: '', text: '' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to fetch courses' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await courseAPI.deleteCourse(courseId);
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
      setMessage({ type: 'success', text: 'Course deleted successfully' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to delete course' 
      });
    }
  };

  const handleEditCourse = (courseId) => {
    navigate(`/admin/courses/${courseId}/edit`);
  };

  const handleViewCourse = (courseId) => {
    navigate(`/admin/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="course-listing-page">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="course-listing-page">
      <div className="header">
        <h1>Manage Courses</h1>
        <button
          className="btn-create"
          onClick={() => navigate('/admin/courses/create')}
        >
          + Create New Course
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search courses by title, description, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="filter-select"
          >
            <option value="">All Levels</option>
            {levels.map((lev) => (
              <option key={lev} value={lev}>
                {lev}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-info">
        Showing {filteredCourses.length} of {courses.length} courses
      </div>

      {filteredCourses.length === 0 ? (
        <div className="no-courses">
          <p>No courses found. Create one to get started!</p>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-thumbnail">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} />
                ) : (
                  <div className="placeholder-thumbnail">
                    {course.title.charAt(0)}
                  </div>
                )}
                <span className={`badge ${course.isPublished ? 'published' : 'draft'}`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="category">{course.category}</p>
                <p className="description">{course.description.substring(0, 100)}...</p>

                <div className="course-meta">
                  <div className="meta-item">
                    <span className="label">Instructor:</span>
                    <span>{course.instructor}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Level:</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Duration:</span>
                    <span>{course.duration}h</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Videos:</span>
                    <span>{course.videos?.length || 0}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Students:</span>
                    <span>{course.enrolledStudents?.length || 0}</span>
                  </div>
                </div>

                <div className="course-actions">
                  <button
                    className="btn-view"
                    onClick={() => handleViewCourse(course._id)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditCourse(course._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
