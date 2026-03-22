import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderPlus, Settings, LogOut, Image, Award, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">N</div>
          <div>
            <h2 className="admin-sidebar__title">Admin Panel</h2>
            <p className="admin-sidebar__role">Portfolio Manager</p>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} />
            Overview
          </NavLink>
          <NavLink
            to="/admin/add-project"
            className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}
          >
            <FolderPlus size={20} />
            Add Project
          </NavLink>
          <NavLink
            to="/admin/manage-projects"
            className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}
          >
            <Settings size={20} />
            Manage Projects
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}
          >
            <Image size={20} />
            Category Settings
          </NavLink>
          <NavLink
            to="/admin/certifications"
            className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}
          >
            <Award size={20} />
            Certifications
          </NavLink>
          <NavLink
            to="/admin/experiences"
            className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}
          >
            <Briefcase size={20} />
            Experiences
          </NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-nav__logout" onClick={handleLogout}>
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <div className="admin-content__inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
