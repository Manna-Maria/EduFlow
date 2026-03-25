import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CourseCreationForm from './pages/CourseCreationForm';
import CourseListingPage from './pages/CourseListingPage';
import VideoUploadPage from './pages/VideoUploadPage';
import CoursePlayer from './pages/CoursePlayer';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ManageCourses from './pages/ManageCourses'
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css';

function App() {
  return (
    
     <Routes>
  {/* Authentication */}
  <Route path="/" element={<LoginPage />} />

  {/* User Routes */}
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  <Route path="/course/:courseId" element={<CoursePlayer />} />
    <Route path="/user/courses" element={<CourseListingPage />} />

  {/* Admin Routes */}
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} />

  {/* Manage Courses */}
  <Route path="/admin/courses" element={<ManageCourses />} />  {/* ✅ this is the page with edit/delete */}
  <Route path="/admin/courses/create" element={<CourseCreationForm />} />
  <Route path="/admin/courses/:id/edit" element={<ProtectedRoute><CourseCreationForm /></ProtectedRoute>} />
  <Route path="/admin/courses/:courseId" element={<CoursePlayer />} />

  {/* Videos */}
  <Route path="/admin/videos/upload" element={<VideoUploadPage />} />
  <Route path="/admin/videos/:id" element={<VideoUploadPage />} />
</Routes>
    
  );
}

export default App;

