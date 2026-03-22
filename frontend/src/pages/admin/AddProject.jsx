import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus } from 'lucide-react';
import { projectsAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminLayout.css';
import './AddProject.css';

const CATEGORIES = [
  'Technical Projects', 'Poster Design', 'UI/UX Design', 'Branding', 'Photography'
];

export default function AddProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    tools: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please upload a project image');
      return;
    }
    setSubmitting(true);
    try {
      await projectsAPI.create({
        title: form.title,
        description: form.description,
        category: form.category,
        tools: form.tools,
        imageFile,
      });
      toast.success('Project published successfully!');
      navigate('/admin/manage-projects');
    } catch (err) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Add New Project</h1>
        <p className="admin-page-sub">Fill in the details to publish a project to your portfolio.</p>
      </div>

      <form onSubmit={handleSubmit} className="add-project__form">
        {/* Project Details */}
        <div className="admin-card add-project__card">
          <h3 className="add-project__section-title">Project Details</h3>

          <div className="add-project__grid">
            <div className="add-project__field">
              <label>Project Title *</label>
              <input
                type="text"
                placeholder="e.g. Albany Foods Poster Design"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="add-project__field">
              <label>Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="add-project__field">
            <label>Description *</label>
            <textarea
              rows={5}
              placeholder="Describe the project, your design process, and the outcome..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="add-project__field">
            <label>Tools Used</label>
            <input
              type="text"
              placeholder="Adobe Photoshop, Figma, Illustrator (comma separated)"
              value={form.tools}
              onChange={(e) => setForm({ ...form, tools: e.target.value })}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="admin-card add-project__card">
          <h3 className="add-project__section-title">Project Image</h3>
          <p className="add-project__upload-note">
            Image will be uploaded to Supabase Storage and linked automatically.
          </p>

          {!preview ? (
            <label className="add-project__upload-zone" htmlFor="img-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="img-upload"
              />
              <Upload size={28} color="var(--accent)" />
              <span className="add-project__upload-text">Click to upload image</span>
              <span className="add-project__upload-hint">PNG, JPG, WEBP · Max 50MB</span>
            </label>
          ) : (
            <div className="add-project__previews">
              <div className="add-project__preview">
                <img src={preview} alt="Preview" />
                <button
                  type="button"
                  className="add-project__remove-img"
                  onClick={removeImage}
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
              <label htmlFor="img-upload-replace" className="add-project__add-more">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="img-upload-replace"
                />
                <Plus size={20} />
                <span>Replace</span>
              </label>
            </div>
          )}
        </div>

        <div className="add-project__actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/admin/manage-projects')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
