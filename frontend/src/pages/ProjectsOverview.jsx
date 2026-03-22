import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CategoryFolder from '../components/CategoryFolder';
import { projectsAPI, categoriesAPI } from '../utils/api';
import './ProjectsOverview.css';

const CATEGORIES = [
  'Technical Projects', 'Poster Design', 'UI/UX Design', 'Branding', 'Photography'
];

export default function ProjectsOverview() {
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, projCounts] = await Promise.all([
          categoriesAPI.getAll(),
          projectsAPI.getCategoryCounts()
        ]);
        // Only show the 4 standardized categories
        const filtered = cats.filter(c => CATEGORIES.includes(c.name));
        // Also ensure all 4 categories appear even if not in DB
        const existing = filtered.map(c => c.name);
        const missing = CATEGORIES.filter(c => !existing.includes(c));
        const allCats = [
          ...filtered,
          ...missing.map(name => ({ name, image_url: null }))
        ];
        setCategories(allCats);
        setCounts(projCounts);
      } catch (err) {
        console.error('Failed to load project data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="projects-overview-page">
      <Navbar />
      <main className="container section-padding">
        <div className="projects-overview__header">
          <span className="section-eyebrow">Portfolio</span>
          <h1 className="section-title">Projects</h1>
          <p className="section-subtitle">
            Explore my work across different fields of design and technology.
          </p>
        </div>

        {loading ? (
          <div className="projects-overview__loading">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="projects-overview__grid">
            {categories.map((cat) => (
              <CategoryFolder 
                key={cat.name} 
                category={cat.name} 
                count={counts[cat.name] || 0}
                imageUrl={cat.image_url}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
