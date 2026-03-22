import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, X, Check, Upload, Plus, ExternalLink } from 'lucide-react';
import { certificationsAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminLayout.css';
import './ManageCertifications.css';

export default function ManageCertifications() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Add form
  const [addForm, setAddForm] = useState({ title: '', organization: '', link: '' });
  const [addImage, setAddImage] = useState(null);
  const [addPreview, setAddPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Edit form
  const [editForm, setEditForm] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCerts = useCallback(async () => {
    try {
      const data = await certificationsAPI.getAll();
      setCerts(data || []);
    } catch {
      toast.error('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddImage(file);
      setAddPreview(URL.createObjectURL(file));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await certificationsAPI.create({
        title: addForm.title,
        organization: addForm.organization,
        link: addForm.link,
        imageFile: addImage,
      });
      toast.success('Certification added!');
      setShowAdd(false);
      setAddForm({ title: '', organization: '', link: '' });
      setAddImage(null);
      setAddPreview(null);
      fetchCerts();
    } catch (err) {
      toast.error(err.message || 'Failed to add certification');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (cert) => {
    setEditingId(cert.id);
    setEditForm({
      title: cert.title,
      organization: cert.organization,
      link: cert.link || '',
      existingImageUrl: cert.image_url,
    });
    setEditImage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditImage(null);
  };

  const saveEdit = async (id) => {
    try {
      toast.loading('Saving...', { id: 'save-cert' });
      await certificationsAPI.update(id, { ...editForm, imageFile: editImage });
      toast.success('Updated!', { id: 'save-cert' });
      setEditingId(null);
      fetchCerts();
    } catch {
      toast.error('Update failed', { id: 'save-cert' });
    }
  };

  const handleDelete = async (cert) => {
    try {
      toast.loading('Deleting...', { id: 'del-cert' });
      await certificationsAPI.delete(cert.id, cert.image_url);
      toast.success('Deleted', { id: 'del-cert' });
      setDeleteConfirm(null);
      fetchCerts();
    } catch {
      toast.error('Delete failed', { id: 'del-cert' });
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manage Certifications</h1>
          <p className="admin-page-sub">{certs.length} certification{certs.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={16} />
          {showAdd ? 'Cancel' : 'Add Certification'}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <form onSubmit={handleAddSubmit} className="admin-card cert-add-form">
          <h3 className="cert-add-form__title">New Certification</h3>
          <div className="cert-add-form__grid">
            <div className="cert-add-form__field">
              <label>Title *</label>
              <input
                type="text"
                placeholder="e.g. Google UX Design Certificate"
                value={addForm.title}
                onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                required
              />
            </div>
            <div className="cert-add-form__field">
              <label>Organization *</label>
              <input
                type="text"
                placeholder="e.g. Google / Coursera"
                value={addForm.organization}
                onChange={(e) => setAddForm({ ...addForm, organization: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="cert-add-form__field">
            <label>Certificate Link (PDF or URL)</label>
            <input
              type="url"
              placeholder="https://..."
              value={addForm.link}
              onChange={(e) => setAddForm({ ...addForm, link: e.target.value })}
            />
          </div>
          <div className="cert-add-form__field">
            <label>Preview Image</label>
            {addPreview ? (
              <div className="cert-add-form__preview">
                <img src={addPreview} alt="Preview" />
                <button type="button" onClick={() => { setAddImage(null); setAddPreview(null); }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="cert-add-form__upload" htmlFor="cert-img-upload">
                <input type="file" accept="image/*" id="cert-img-upload" style={{ display: 'none' }} onChange={handleAddImage} />
                <Upload size={20} />
                <span>Upload image</span>
              </label>
            )}
          </div>
          <div className="cert-add-form__actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Certification'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="manage__loading">Loading certifications...</div>
      ) : certs.length === 0 && !showAdd ? (
        <div className="admin-card manage__empty">
          <p>No certifications yet. Click "Add Certification" to get started.</p>
        </div>
      ) : (
        <div className="manage__list">
          {certs.map((cert) => (
            <div key={cert.id} className="manage__item">
              {/* Thumbnail */}
              <div className="manage__thumb">
                {cert.image_url ? (
                  <img src={editingId === cert.id && editImage ? URL.createObjectURL(editImage) : cert.image_url} alt={cert.title} />
                ) : (
                  <div className="manage__thumb-placeholder">No img</div>
                )}
                {editingId === cert.id && (
                  <label className="manage__thumb-overlay">
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setEditImage(e.target.files[0])} />
                    <Upload size={14} />
                  </label>
                )}
              </div>

              {/* Content */}
              {editingId === cert.id ? (
                <div className="manage__edit-form">
                  <div className="manage__edit-row">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Title"
                      className="manage__edit-input"
                    />
                    <input
                      value={editForm.organization}
                      onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                      placeholder="Organization"
                      className="manage__edit-input"
                    />
                  </div>
                  <input
                    value={editForm.link}
                    onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    placeholder="Certificate link (URL)"
                    className="manage__edit-input"
                  />
                </div>
              ) : (
                <div className="manage__info">
                  <div className="manage__info-header">
                    <h3 className="manage__title">{cert.title}</h3>
                    <span className="dashboard__cat-badge">{cert.organization}</span>
                  </div>
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-list__link">
                      <ExternalLink size={12} /> View
                    </a>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="manage__actions">
                {editingId === cert.id ? (
                  <>
                    <button className="manage__action-btn manage__action-btn--save" onClick={() => saveEdit(cert.id)} title="Save">
                      <Check size={16} />
                    </button>
                    <button className="manage__action-btn" onClick={cancelEdit} title="Cancel">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="manage__action-btn manage__action-btn--edit" onClick={() => startEdit(cert)} title="Edit">
                      <Pencil size={16} />
                    </button>
                    {deleteConfirm === cert.id ? (
                      <div className="manage__delete-confirm">
                        <span>Delete?</span>
                        <button className="manage__action-btn manage__action-btn--danger" onClick={() => handleDelete(cert)}>Yes</button>
                        <button className="manage__action-btn" onClick={() => setDeleteConfirm(null)}>No</button>
                      </div>
                    ) : (
                      <button className="manage__action-btn manage__action-btn--danger-outline" onClick={() => setDeleteConfirm(cert.id)} title="Delete">
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
