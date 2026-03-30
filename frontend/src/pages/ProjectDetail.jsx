import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Tag, ExternalLink } from 'lucide-react';
import { projectsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectsAPI.getById(id);
        setProject(data);
      } catch {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="detail__loading">
          <div className="detail__spinner" />
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="detail__not-found">
          <h2>Project not found</h2>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </>
    );
  }

  // Parse comma-separated tools string into an array
  const toolsArray = project.tools
    ? project.tools.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <>
      <Navbar />
      <div className="detail">
        <div className="container">
          {/* Back */}
          <button className="detail__back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Back to Projects
          </button>

          {/* Header */}
          <div className="detail__header">
            <span className="project-card__category">{project.category}</span>
            <h1 className="detail__title">{project.title}</h1>
          </div>

          {/* Main image */}
          {project.image_url && (
            <div className="detail__gallery">
              <div className="detail__main-img">
                <img src={project.image_url} alt={project.title} />
              </div>
            </div>
          )}

          {/* Info grid */}
          <div className="detail__info-grid">
            <div className="detail__section">
              <h2 className="detail__section-title">
                <Tag size={18} /> About This Project
              </h2>
              <p className="detail__description">{project.description}</p>
            </div>

            <div className="detail__sidebar">
              {toolsArray.length > 0 && (
                <div className="detail__meta-card">
                  <h3 className="detail__meta-title">
                    <Wrench size={16} /> Tools Used
                  </h3>
                  <div className="detail__tools">
                    {toolsArray.map((tool) => (
                      <span key={tool} className="detail__tool-badge">{tool}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail__meta-card">
                <h3 className="detail__meta-title">Category</h3>
                <p className="detail__meta-value">{project.category}</p>
              </div>

              <div className="detail__meta-card">
                <h3 className="detail__meta-title">Date</h3>
                <p className="detail__meta-value">
                  {new Date(project.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>

              {project.link && (
                <div className="detail__meta-card detail__meta-card--action">
                  <h3 className="detail__meta-title">Project Link</h3>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary detail__link-btn"
                  >
                    {project.category === 'Technical Projects' ? 'View Live Demo' : 
                     project.category === 'UI/UX Design' ? 'View Case Study' : 'Visit Project'}
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
