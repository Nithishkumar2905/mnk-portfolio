import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { projectsAPI } from '../utils/api';
import { ArrowLeft } from 'lucide-react';
import './CategoryProjects.css';

export default function CategoryProjects() {
  const { category } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAll(category);
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
    window.scrollTo(0, 0);
  }, [category]);

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div className="category-projects-page">
      <Navbar />
      <main className="container section-padding">
        <Link to="/projects" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to Categories</span>
        </Link>

        <div className="category-projects__header">
          <span className="section-eyebrow">Portfolio</span>
          <h1 className="section-title">{category}</h1>
          <p className="category-projects__count">
            {projects.length} Project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="projects-overview__loading">
            <div className="loader"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="category-projects__empty">
            <p>No projects found in this category yet.</p>
            <Link to="/admin/add-project" className="btn btn-outline">Add One Now</Link>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="pinterest-grid"
            columnClassName="pinterest-grid__column"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Masonry>
        )}
      </main>
    </div>
  );
}
