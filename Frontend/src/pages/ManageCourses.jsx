import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import './CourseListingPage.css';

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAllCourses();
      setCourses(response.data.data || []);
      setMessage({ type: '', text: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch courses' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (courseId) => {
    navigate(`/admin/courses/${courseId}/edit`);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await courseAPI.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      setMessage({ type: 'success', text: 'Course deleted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete course' });
    }
  };

  if (loading) return <div className="loading">Loading courses...</div>;

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
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-thumbnail">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} />
                ) : (
                  <div className="placeholder-thumbnail">
                    {course.title.charAt(0)}
                  </div>
                )}
                <span
                  className={`badge ${course.isPublished ? 'published' : 'draft'}`}
                >
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="category">{course.category}</p>
                <p className="description">{course.description?.substring(0, 100)}...</p>

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