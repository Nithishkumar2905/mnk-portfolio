import { useState, useEffect } from 'react';
import { Upload, Image, CheckCircle2 } from 'lucide-react';
import { categoriesAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminLayout.css';
import './CategorySettings.css';

export default function CategorySettings() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null); // stores name of category being uploaded

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (categoryName, file) => {
    if (!file) return;
    
    setUploading(categoryName);
    try {
      await categoriesAPI.updateImage(categoryName, file);
      toast.success(`Updated image for ${categoryName}`);
      fetchCategories(); // refresh list
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Category Settings</h1>
        <p className="admin-page-sub">Upload and manage cover images for your project categories.</p>
      </div>

      {loading ? (
        <div className="manage__loading">Loading...</div>
      ) : (
        <div className="category-settings__grid">
          {categories.map((cat) => (
            <div key={cat.name} className="admin-card category-settings__card">
              <div className="category-settings__img-preview">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} />
                ) : (
                  <div className="category-settings__no-img">
                    <Image size={40} />
                    <span>No Image Set</span>
                  </div>
                )}
                {uploading === cat.name && (
                  <div className="category-settings__uploading-overlay">
                    <div className="loader"></div>
                  </div>
                )}
              </div>
              
              <div className="category-settings__content">
                <div className="category-settings__info">
                  <h3 className="category-settings__name">{cat.name}</h3>
                  {cat.image_url && (
                    <span className="category-settings__status">
                      <CheckCircle2 size={14} /> Active
                    </span>
                  )}
                </div>
                
                <label className="btn btn-outline category-settings__upload-btn">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={!!uploading}
                    onChange={(e) => handleImageUpload(cat.name, e.target.files[0])}
                  />
                  <Upload size={16} />
                  {cat.image_url ? 'Replace Image' : 'Upload Image'}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
