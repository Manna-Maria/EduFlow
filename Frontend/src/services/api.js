import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== AUTH ENDPOINTS =====

export const authAPI = {
  // Register a new user
  register: (userData) => API.post("/auth/register", userData),

  // Login user
  login: (credentials) => API.post("/auth/login", credentials),

  // Get current user
  getCurrentUser: () => API.get("/auth/me"),

  // Logout
  logout: () => API.post("/auth/logout"),
};

// ===== COURSE ENDPOINTS =====

export const courseAPI = {
  // Create a new course
  createCourse: (courseData) => API.post("/courses", courseData),

  // Get all courses
  getAllCourses: (filters = {}) => API.get("/courses", { params: filters }),

  // Get a specific course by ID
  getCourseById: (courseId) => API.get(`/courses/${courseId}`),

  // Update a course
  updateCourse: (courseId, courseData) => API.put(`/courses/${courseId}`, courseData),

  // Delete a course
  deleteCourse: (courseId) => API.delete(`/courses/${courseId}`),

  // Add module to course
  addModule: (courseId, moduleData) => API.post(`/courses/${courseId}/modules`, moduleData),

  // Get course statistics
  getCourseStats: (courseId) => API.get(`/courses/${courseId}/stats`)
};

// ===== VIDEO ENDPOINTS =====

export const videoAPI = {
  // Upload a new video
  uploadVideo: (videoData, config = {}) => API.post("/videos", videoData, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      ...config.headers
    }
  }),

  // Get all videos
  getAllVideos: (filters = {}) => API.get("/videos", { params: filters }),

  // Get a specific video by ID
  getVideoById: (videoId) => API.get(`/videos/${videoId}`),

  // Get videos by course ID
  getVideosByCourse: (courseId) => API.get(`/videos/course/${courseId}`),

  // Update a video
  updateVideo: (videoId, videoData) => API.put(`/videos/${videoId}`, videoData),

  // Delete a video
  deleteVideo: (videoId) => API.delete(`/videos/${videoId}`),

  // Reorder videos in a course
  reorderVideos: (courseId, videoOrder) => API.put(`/videos/course/${courseId}/reorder`, { videoOrder }),

  // Get video analytics
  getVideoAnalytics: (videoId) => API.get(`/videos/${videoId}/analytics`)
};

export default API;