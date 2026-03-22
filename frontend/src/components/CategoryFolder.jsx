import { useNavigate } from 'react-router-dom';
import './CategoryFolder.css';

export default function CategoryFolder({ category, count, imageUrl }) {
  const navigate = useNavigate();

  return (
    <div 
      className="category-folder" 
      onClick={() => navigate(`/projects/category/${encodeURIComponent(category)}`)}
    >
      <div className="category-folder__img-wrapper">
        {imageUrl ? (
          <img src={imageUrl} alt={category} className="category-folder__img" />
        ) : (
          <div className="category-folder__placeholder">
            <span className="category-folder__initial">{category.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="category-folder__info">
        <h3 className="category-folder__name">{category}</h3>
        <p className="category-folder__count">{count || 0} Projects</p>
      </div>
    </div>
  );
}
