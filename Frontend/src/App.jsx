import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import CourseCreationForm from './pages/CourseCreationForm';
import CourseListingPage from './pages/CourseListingPage';
import VideoUploadPage from './pages/VideoUploadPage';
import CoursePlayer from './pages/CoursePlayer';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/course/:courseId" element={<CoursePlayer />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<CourseListingPage />} />
        <Route path="/admin/courses/create" element={<CourseCreationForm />} />
        <Route path="/admin/courses/:id/edit" element={<CourseCreationForm />} />
        <Route path="/admin/courses/:courseId" element={<CoursePlayer />} />
        <Route path="/admin/videos/upload" element={<VideoUploadPage />} />
        <Route path="/admin/videos/:id" element={<VideoUploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
