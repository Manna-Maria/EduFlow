import { useState } from 'react';
import { courseAPI } from '../services/api';
import './CourseCreationForm.css';

export default function CourseCreationForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    instructor: '',
    instructorEmail: '',
    duration: '',
    level: 'Beginner',
    thumbnail: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = ['Programming', 'Design', 'Business', 'Science', 'Math', 'Languages', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.instructor || !formData.instructorEmail || !formData.duration) {
        setMessage({ type: 'error', text: 'Please fill all required fields' });
        setLoading(false);
        return;
      }

      const response = await courseAPI.createCourse({
        ...formData,
        duration: parseInt(formData.duration)
      });

      setMessage({ type: 'success', text: 'Course created successfully!' });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Programming',
        instructor: '',
        instructorEmail: '',
        duration: '',
        level: 'Beginner',
        thumbnail: ''
      });

      // Redirect or show success
      setTimeout(() => {
        window.location.href = '/admin/courses';
      }, 1500);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to create course' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-creation-form">
      <div className="form-container">
        <h1>Create New Course</h1>
        
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Course Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter course title"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter course description"
              maxLength={1000}
              rows={5}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="level">Level *</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
              >
                {levels.map((lev) => (
                  <option key={lev} value={lev}>
                    {lev}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="instructor">Instructor Name *</label>
            <input
              type="text"
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              placeholder="Enter instructor name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="instructorEmail">Instructor Email *</label>
            <input
              type="email"
              id="instructorEmail"
              name="instructorEmail"
              value={formData.instructorEmail}
              onChange={handleChange}
              placeholder="Enter instructor email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (Hours) *</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter course duration in hours"
              min={1}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail">Thumbnail URL</label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="Enter thumbnail image URL (optional)"
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Creating Course...' : 'Create Course'}
          </button>
        </form>
      </div>
    </div>
  );
}
