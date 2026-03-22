import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, X, Check, Plus, Briefcase, MapPin, Calendar } from 'lucide-react';
import { experiencesAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminLayout.css';
import './ManageExperiences.css';

export default function ManageExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Add form
  const [addForm, setAddForm] = useState({
    company: '', role: '', period: '', location: '', description: '', skills: '', sort_order: 0
  });
  const [submitting, setSubmitting] = useState(false);

  // Edit form
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchExperiences = useCallback(async () => {
    try {
      const data = await experiencesAPI.getAll();
      setExperiences(data || []);
    } catch {
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExperiences(); }, [fetchExperiences]);

  const resetAddForm = () => {
    setAddForm({ company: '', role: '', period: '', location: '', description: '', skills: '', sort_order: 0 });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await experiencesAPI.create(addForm);
      toast.success('Experience added!');
      setShowAdd(false);
      resetAddForm();
      fetchExperiences();
    } catch (err) {
      toast.error(err.message || 'Failed to add experience');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (exp) => {
    setEditingId(exp.id);
    setEditForm({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      skills: exp.skills,
      sort_order: exp.sort_order || 0,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      toast.loading('Saving...', { id: 'save-exp' });
      await experiencesAPI.update(id, editForm);
      toast.success('Updated!', { id: 'save-exp' });
      setEditingId(null);
      fetchExperiences();
    } catch {
      toast.error('Update failed', { id: 'save-exp' });
    }
  };

  const handleDelete = async (exp) => {
    try {
      toast.loading('Deleting...', { id: 'del-exp' });
      await experiencesAPI.delete(exp.id);
      toast.success('Deleted', { id: 'del-exp' });
      setDeleteConfirm(null);
      fetchExperiences();
    } catch {
      toast.error('Delete failed', { id: 'del-exp' });
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manage Experiences</h1>
          <p className="admin-page-sub">{experiences.length} experience{experiences.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={16} />
          {showAdd ? 'Cancel' : 'Add Experience'}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <form onSubmit={handleAddSubmit} className="admin-card exp-add-form">
          <h3 className="exp-add-form__title">New Experience</h3>
          <div className="exp-add-form__grid">
            <div className="exp-add-form__field">
              <label>Company / Organization *</label>
              <input
                type="text"
                placeholder="e.g. Fiverr"
                value={addForm.company}
                onChange={(e) => setAddForm({ ...addForm, company: e.target.value })}
                required
              />
            </div>
            <div className="exp-add-form__field">
              <label>Role / Title *</label>
              <input
                type="text"
                placeholder="e.g. Freelance Graphic Designer"
                value={addForm.role}
                onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="exp-add-form__grid">
            <div className="exp-add-form__field">
              <label>Period *</label>
              <input
                type="text"
                placeholder="e.g. 2021 - Present"
                value={addForm.period}
                onChange={(e) => setAddForm({ ...addForm, period: e.target.value })}
                required
              />
            </div>
            <div className="exp-add-form__field">
              <label>Location *</label>
              <input
                type="text"
                placeholder="e.g. Remote"
                value={addForm.location}
                onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="exp-add-form__field">
            <label>Description *</label>
            <textarea
              rows={4}
              placeholder="Describe your role, responsibilities, and achievements..."
              value={addForm.description}
              onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
              required
            />
          </div>
          <div className="exp-add-form__grid">
            <div className="exp-add-form__field">
              <label>Skills (comma separated)</label>
              <input
                type="text"
                placeholder="Branding, Adobe Suite, Client Relations"
                value={addForm.skills}
                onChange={(e) => setAddForm({ ...addForm, skills: e.target.value })}
              />
            </div>
            <div className="exp-add-form__field">
              <label>Sort Order</label>
              <input
                type="number"
                placeholder="0"
                value={addForm.sort_order}
                onChange={(e) => setAddForm({ ...addForm, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="exp-add-form__actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Experience'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="manage__loading">Loading experiences...</div>
      ) : experiences.length === 0 && !showAdd ? (
        <div className="admin-card manage__empty">
          <p>No experiences yet. Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="manage__list">
          {experiences.map((exp) => (
            <div key={exp.id} className="manage__item exp-item">
              {/* Icon */}
              <div className="exp-item__icon">
                <Briefcase size={20} />
              </div>

              {/* Content */}
              {editingId === exp.id ? (
                <div className="manage__edit-form">
                  <div className="manage__edit-row">
                    <input
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      placeholder="Company"
                      className="manage__edit-input"
                    />
                    <input
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      placeholder="Role"
                      className="manage__edit-input"
                    />
                  </div>
                  <div className="manage__edit-row">
                    <input
                      value={editForm.period}
                      onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                      placeholder="Period"
                      className="manage__edit-input"
                    />
                    <input
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="Location"
                      className="manage__edit-input"
                    />
                  </div>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Description"
                    className="manage__edit-input"
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                  <div className="manage__edit-row">
                    <input
                      value={editForm.skills}
                      onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                      placeholder="Skills (comma separated)"
                      className="manage__edit-input"
                    />
                    <input
                      type="number"
                      value={editForm.sort_order}
                      onChange={(e) => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) || 0 })}
                      placeholder="Sort order"
                      className="manage__edit-input"
                    />
                  </div>
                </div>
              ) : (
                <div className="manage__info">
                  <div className="manage__info-header">
                    <h3 className="manage__title">{exp.role}</h3>
                    <span className="dashboard__cat-badge">{exp.company}</span>
                  </div>
                  <div className="exp-item__meta">
                    <span className="exp-item__meta-item">
                      <Calendar size={13} /> {exp.period}
                    </span>
                    <span className="exp-item__meta-item">
                      <MapPin size={13} /> {exp.location}
                    </span>
                  </div>
                  <p className="manage__desc">{exp.description?.slice(0, 120)}...</p>
                  {exp.skills && (
                    <div className="manage__tools">
                      {exp.skills.split(',').slice(0, 5).map((s) => (
                        <span key={s} className="exp-item__skill-tag">{s.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="manage__actions">
                {editingId === exp.id ? (
                  <>
                    <button className="manage__action-btn manage__action-btn--save" onClick={() => saveEdit(exp.id)} title="Save">
                      <Check size={16} />
                    </button>
                    <button className="manage__action-btn" onClick={cancelEdit} title="Cancel">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="manage__action-btn manage__action-btn--edit" onClick={() => startEdit(exp)} title="Edit">
                      <Pencil size={16} />
                    </button>
                    {deleteConfirm === exp.id ? (
                      <div className="manage__delete-confirm">
                        <span>Delete?</span>
                        <button className="manage__action-btn manage__action-btn--danger" onClick={() => handleDelete(exp)}>Yes</button>
                        <button className="manage__action-btn" onClick={() => setDeleteConfirm(null)}>No</button>
                      </div>
                    ) : (
                      <button className="manage__action-btn manage__action-btn--danger-outline" onClick={() => setDeleteConfirm(exp.id)} title="Delete">
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
