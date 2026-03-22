import { Link } from 'react-router-dom';
import './ProjectCard.css';

export default function ProjectCard({ project }) {
  const { id, title, category, image_url } = project;

  const imageUrl =
    image_url ||
    `https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80`;

  return (
    <Link to={`/projects/${id}`} className="project-card" aria-label={title}>
      <div className="project-card__img-wrap">
        <img src={imageUrl} alt={title} className="project-card__img" loading="lazy" />
        <div className="project-card__overlay">
          <span className="project-card__view">View Project →</span>
        </div>
      </div>
      <div className="project-card__body">
        <span className="project-card__category">{category}</span>
        <h3 className="project-card__title">{title}</h3>
      </div>
    </Link>
  );
}
