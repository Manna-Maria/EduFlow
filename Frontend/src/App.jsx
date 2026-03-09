import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CourseCreationForm from './pages/CourseCreationForm';
import CourseListingPage from './pages/CourseListingPage';
import VideoUploadPage from './pages/VideoUploadPage';
import CoursePlayer from './pages/CoursePlayer';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css';

function App() {
  return (
    
      <Routes>

        {/* Authentication Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected User Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute>
              <CoursePlayer />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute>
              <CourseListingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses/create"
          element={
            <ProtectedRoute>
              <CourseCreationForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses/:id/edit"
          element={
            <ProtectedRoute>
              <CourseCreationForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses/:courseId"
          element={
            <ProtectedRoute>
              <CoursePlayer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/videos/upload"
          element={
            <ProtectedRoute>
              <VideoUploadPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/videos/:id"
          element={
            <ProtectedRoute>
              <VideoUploadPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    
  );
}

export default App;