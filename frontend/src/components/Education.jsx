import { useState, useEffect } from 'react';
import { GraduationCap, Award, ExternalLink } from 'lucide-react';
import { certificationsAPI } from '../utils/api';
import ScrollReveal from './ScrollReveal';
import './Education.css';

const EDUCATION = [
  {
    institution: 'SRM Institute of Science and Technology',
    course: 'B.Tech Computer Science',
    duration: '2023 – 2027',
  },
  {
    institution: 'Sri Vijay Vidyalaya Matric Higher Secondary School',
    course: '10th and 12th',
    duration: '2020 – 2021',
  },
];

export default function Education() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const data = await certificationsAPI.getAll();
        setCertifications(data || []);
      } catch (err) {
        console.error('Failed to load certifications:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  return (
    <section className="education section-padding" id="education">
      <div className="container">
        <div className="education__header-group">
          <span className="section-eyebrow">Background</span>
          <h2 className="section-title">Education & Certifications</h2>
          <p className="section-subtitle">
            Academic foundation and professional credentials.
          </p>
        </div>

        {/* Education */}
        <div className="education__section">
          <h3 className="education__section-label">
            <GraduationCap size={20} />
            Education
          </h3>
          <div className="education__cards">
            {EDUCATION.map((edu, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="education__card">
                  <h4 className="education__institution">{edu.institution}</h4>
                  <p className="education__course">{edu.course}</p>
                  <span className="education__duration">{edu.duration}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="education__section">
          <h3 className="education__section-label">
            <Award size={20} />
            Certifications
          </h3>

          {loading ? (
            <p className="education__loading">Loading certifications...</p>
          ) : certifications.length === 0 ? (
            <p className="education__empty">No certifications added yet.</p>
          ) : (
            <div className="education__cert-grid">
              {certifications.map((cert, i) => (
                <ScrollReveal key={cert.id} delay={i * 100}>
                  <div className="education__cert-card">
                    {cert.image_url && (
                      <div className="education__cert-img">
                        <img src={cert.image_url} alt={cert.title} />
                      </div>
                    )}
                    <div className="education__cert-content">
                      <h4 className="education__cert-title">{cert.title}</h4>
                      <p className="education__cert-org">{cert.organization}</p>
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="education__cert-link"
                        >
                          <ExternalLink size={14} />
                          View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
