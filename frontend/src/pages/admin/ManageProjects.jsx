import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, X, Check, Search, Upload } from 'lucide-react';
import { projectsAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminLayout.css';
import './ManageProjects.css';

const CATEGORIES = [
  'Technical Projects', 'Poster Design', 'UI/UX Design', 'Branding', 'Photography'
];

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data || []);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const startEdit = (project) => {
    setEditingId(project.id);
    setEditForm({
      title: project.title,
      category: project.category,
      description: project.description,
      tools: project.tools || '',
      existingImageUrl: project.image_url,
    });
    setEditImageFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setEditImageFile(file);
  };

  const saveEdit = async (id) => {
    try {
      toast.loading('Saving changes...', { id: 'save-edit' });
      await projectsAPI.update(id, {
        ...editForm,
        imageFile: editImageFile,
      });
      toast.success('Project updated!', { id: 'save-edit' });
      setEditingId(null);
      fetchProjects();
    } catch {
      toast.error('Update failed', { id: 'save-edit' });
    }
  };

  const handleDelete = async (project) => {
    try {
      toast.loading('Deleting project...', { id: 'del-proj' });
      await projectsAPI.delete(project.id, project.image_url);
      toast.success('Project deleted', { id: 'del-proj' });
      setDeleteConfirm(null);
      fetchProjects();
    } catch {
      toast.error('Delete failed', { id: 'del-proj' });
    }
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manage Projects</h1>
        <p className="admin-page-sub">{projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio</p>
      </div>

      {/* Search */}
      <div className="manage__search-wrap">
        <Search size={16} className="manage__search-icon" />
        <input
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="manage__search"
        />
      </div>

      {loading ? (
        <div className="manage__loading">Loading projects...</div>
      ) : filtered.length === 0 ? (
        <div className="admin-card manage__empty">
          <p>No projects found.{' '}
            <Link to="/admin/add-project">Add your first project →</Link>
          </p>
        </div>
      ) : (
        <div className="manage__list">
          {filtered.map((project) => (
            <div key={project.id} className="manage__item">
              {/* Thumbnail */}
              <div className="manage__thumb">
                <img
                  src={
                    editingId === project.id && editImageFile
                      ? URL.createObjectURL(editImageFile)
                      : project.image_url || 'https://via.placeholder.com/80x64'
                  }
                  alt={project.title}
                />
                {editingId === project.id && (
                  <label className="manage__thumb-overlay">
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                    <Upload size={14} />
                  </label>
                )}
              </div>

              {/* Content */}
              {editingId === project.id ? (
                <div className="manage__edit-form">
                  <div className="manage__edit-row">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Project title"
                      className="manage__edit-input"
                    />
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="manage__edit-input"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <input
                    value={editForm.tools}
                    onChange={(e) => setEditForm({ ...editForm, tools: e.target.value })}
                    placeholder="Tools (comma separated)"
                    className="manage__edit-input"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Description"
                    className="manage__edit-input"
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              ) : (
                <div className="manage__info">
                  <div className="manage__info-header">
                    <h3 className="manage__title">{project.title}</h3>
                    <span className="dashboard__cat-badge">{project.category}</span>
                  </div>
                  <p className="manage__desc">{project.description?.slice(0, 100)}...</p>
                  <div className="manage__tools">
                    {project.tools?.split(',').slice(0, 4).map((t) => (
                      <span key={t} className="detail__tool-badge">{t.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="manage__actions">
                {editingId === project.id ? (
                  <>
                    <button className="manage__action-btn manage__action-btn--save" onClick={() => saveEdit(project.id)} title="Save">
                      <Check size={16} />
                    </button>
                    <button className="manage__action-btn" onClick={cancelEdit} title="Cancel">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="manage__action-btn manage__action-btn--edit" onClick={() => startEdit(project)} title="Edit">
                      <Pencil size={16} />
                    </button>
                    {deleteConfirm === project.id ? (
                      <div className="manage__delete-confirm">
                        <span>Delete?</span>
                        <button className="manage__action-btn manage__action-btn--danger" onClick={() => handleDelete(project)}>
                          Yes
                        </button>
                        <button className="manage__action-btn" onClick={() => setDeleteConfirm(null)}>
                          No
                        </button>
                      </div>
                    ) : (
                      <button className="manage__action-btn manage__action-btn--danger-outline" onClick={() => setDeleteConfirm(project.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
