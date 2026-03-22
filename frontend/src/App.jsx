import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/admin/PrivateRoute';

// Public pages
import Home from './pages/Home';
import ProjectsOverview from './pages/ProjectsOverview';
import CategoryProjects from './pages/CategoryProjects';
import ProjectDetail from './pages/ProjectDetail';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CategorySettings from './pages/admin/CategorySettings';
import AddProject from './pages/admin/AddProject';
import ManageProjects from './pages/admin/ManageProjects';
import ManageCertifications from './pages/admin/ManageCertifications';
import ManageExperiences from './pages/admin/ManageExperiences';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsOverview />} />
          <Route path="/projects/category/:category" element={<CategoryProjects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />

          {/* Admin auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected */}
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-project" element={<AddProject />} />
              <Route path="manage-projects" element={<ManageProjects />} />
              <Route path="categories" element={<CategorySettings />} />
              <Route path="certifications" element={<ManageCertifications />} />
              <Route path="experiences" element={<ManageExperiences />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
