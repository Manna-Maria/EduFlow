import { useState } from 'react';
import { videoAPI, courseAPI } from '../services/api';
import './VideoUploadPage.css';

export default function VideoUploadPage() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    duration: '',
    order: 0,
    module: '',
    section: '',
    uploadedBy: '',
    videoUrl: ''
  });

  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch courses on component mount
  useState(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await courseAPI.getAllCourses();
      setCourses(response.data.data);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to fetch courses' 
      });
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setMessage({ type: 'error', text: 'Please select a valid video file' });
        return;
      }
      setVideoFile(file);
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setUploadProgress(0);

    try {
      // Validate required fields
      if (!formData.title || !formData.courseId || !formData.duration || !formData.uploadedBy) {
        setMessage({ type: 'error', text: 'Please fill all required fields' });
        setLoading(false);
        return;
      }

      if (!videoFile && !formData.videoUrl) {
        setMessage({ type: 'error', text: 'Please select a video file or provide a video URL' });
        setLoading(false);
        return;
      }

      // Prepare form data
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('courseId', formData.courseId);
      uploadData.append('duration', parseInt(formData.duration));
      uploadData.append('order', parseInt(formData.order));
      uploadData.append('module', formData.module);
      uploadData.append('section', formData.section);
      uploadData.append('uploadedBy', formData.uploadedBy);
      
      if (videoFile) {
        uploadData.append('video', videoFile);
      } else {
        uploadData.append('videoUrl', formData.videoUrl);
      }

      const response = await videoAPI.uploadVideo(uploadData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      setMessage({ type: 'success', text: 'Video uploaded successfully!' });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        courseId: '',
        duration: '',
        order: 0,
        module: '',
        section: '',
        uploadedBy: '',
        videoUrl: ''
      });
      setVideoFile(null);
      setUploadProgress(0);

      // Redirect
      setTimeout(() => {
        window.location.href = '/admin/videos';
      }, 1500);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to upload video' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-upload-page">
      <div className="upload-container">
        <h1>Upload Video</h1>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Video Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter video description"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="courseId">Course *</label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
              disabled={coursesLoading}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration (seconds) *</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Video duration in seconds"
                min={1}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="order">Order</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                placeholder="Video order in course"
                min={0}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="module">Module</label>
              <input
                type="text"
                id="module"
                name="module"
                value={formData.module}
                onChange={handleChange}
                placeholder="Module name (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="section">Section</label>
              <input
                type="text"
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder="Section name (optional)"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="uploadedBy">Uploaded By (User ID) *</label>
            <input
              type="text"
              id="uploadedBy"
              name="uploadedBy"
              value={formData.uploadedBy}
              onChange={handleChange}
              placeholder="Your user ID"
              required
            />
          </div>

          <div className="form-group">
            <label>Video File or URL</label>
            <div className="video-input-section">
              <div className="file-upload">
                <label htmlFor="videoFile">Select Video File</label>
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={handleFileChange}
                />
                {videoFile && (
                  <p className="file-selected">📁 {videoFile.name}</p>
                )}
              </div>

              <div className="divider">OR</div>

              <div className="form-group">
                <label htmlFor="videoUrl">Video URL</label>
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                />
              </div>
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
                {uploadProgress}%
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? `Uploading... ${uploadProgress}%` : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
}
