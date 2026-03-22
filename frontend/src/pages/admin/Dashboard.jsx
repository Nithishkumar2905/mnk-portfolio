import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, PlusCircle, Layers } from 'lucide-react';
import { projectsAPI } from '../../utils/api';
import './AdminLayout.css';
import './Dashboard.css';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsAPI.getAll()
      .then((data) => { setProjects(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categoryCounts = projects.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-sub">Welcome back! Here's an overview of your portfolio.</p>
      </div>

      {/* Stats */}
      <div className="dashboard__stats">
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon">
            <FolderOpen size={22} color="#818cf8" />
          </div>
          <div>
            <p className="dashboard__stat-num">{loading ? '—' : projects.length}</p>
            <p className="dashboard__stat-label">Total Projects</p>
          </div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon">
            <Layers size={22} color="#818cf8" />
          </div>
          <div>
            <p className="dashboard__stat-num">{loading ? '—' : Object.keys(categoryCounts).length}</p>
            <p className="dashboard__stat-label">Categories</p>
          </div>
        </div>

        <Link to="/admin/add-project" className="dashboard__stat-card dashboard__stat-card--cta">
          <PlusCircle size={22} />
          <span>Add New Project</span>
        </Link>
      </div>

      {/* Recent Projects */}
      <div className="admin-card" style={{ marginTop: '24px' }}>
        <h2 className="dashboard__section-title">Recent Projects</h2>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        ) : projects.length === 0 ? (
          <div className="dashboard__empty">
            <p>No projects yet. <Link to="/admin/add-project">Add your first project →</Link></p>
          </div>
        ) : (
          <div className="dashboard__table-wrap">
            <table className="dashboard__table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 10).map((p) => (
                  <tr key={p.id}>
                    <td className="dashboard__td-title">{p.title}</td>
                    <td><span className="dashboard__cat-badge">{p.category}</span></td>
                    <td>{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                    <td>
                      <Link to="/admin/manage-projects" className="dashboard__action-link">Manage →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category breakdown */}
      {!loading && Object.keys(categoryCounts).length > 0 && (
        <div className="admin-card" style={{ marginTop: '20px' }}>
          <h2 className="dashboard__section-title">Projects by Category</h2>
          <div className="dashboard__cats">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div key={cat} className="dashboard__cat-row">
                <span className="dashboard__cat-name">{cat}</span>
                <div className="dashboard__cat-bar-bg">
                  <div
                    className="dashboard__cat-bar-fill"
                    style={{ width: `${(count / projects.length) * 100}%` }}
                  />
                </div>
                <span className="dashboard__cat-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
