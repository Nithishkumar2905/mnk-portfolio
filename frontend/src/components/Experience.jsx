import { useState, useEffect } from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { experiencesAPI } from '../utils/api';
import './Experience.css';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    experiencesAPI.getAll()
      .then((data) => { setExperiences(data || []); })
      .catch(() => { /* silently fail, show empty */ })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="experience section-padding" id="experience">
        <div className="container">
          <div className="experience__header-group">
            <span className="section-eyebrow">Career Path</span>
            <h2 className="section-title">Professional Experience</h2>
            <p className="section-subtitle">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (experiences.length === 0) return null;

  return (
    <section className="experience section-padding" id="experience">
      <div className="container">
        <div className="experience__header-group">
          <span className="section-eyebrow">Career Path</span>
          <h2 className="section-title">Professional Experience</h2>
          <p className="section-subtitle">
            A journey through my creative and technical professional milestones.
          </p>
        </div>

        <div className="experience__grid">
          {experiences.map((item) => (
            <div key={item.id} className="experience__card-wrapper">
              <div className="admin-card experience__card">
                <div className="experience__card-header">
                  <div className="experience__icon">
                    <Briefcase size={20} />
                  </div>
                  <div className="experience__date-badge">
                    <Calendar size={14} />
                    <span>{item.period}</span>
                  </div>
                </div>

                <div className="experience__card-body">
                  <h3 className="experience__role">{item.role}</h3>
                  <h4 className="experience__company">{item.company}</h4>
                  
                  <div className="experience__location">
                    <MapPin size={14} />
                    <span>{item.location}</span>
                  </div>

                  <p className="experience__description">{item.description}</p>

                  {item.skills && (
                    <div className="experience__skills">
                      {item.skills.split(',').map((skill) => (
                        <span key={skill} className="experience__skill-tag">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
