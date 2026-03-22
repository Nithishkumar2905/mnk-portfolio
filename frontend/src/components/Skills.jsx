import { Palette, Layout, Monitor, Camera } from 'lucide-react';
import './Skills.css';

const skills = [
  { name: 'Graphic Design', icon: Palette, level: 90 },
  { name: 'Poster Design', icon: Layout, level: 88 },
  { name: 'UI/UX Design', icon: Monitor, level: 82 },
  { name: 'Prompt Engineering', logo: '/logos/prompt-engineering.svg', level: 50 },
  { name: 'AI Tools (Generative AI)', logo: '/logos/ai-tools.svg', level: 65 },
  { name: 'HTML & CSS', logo: '/logos/html-css.svg', level: 75 },
  { name: 'Photography', icon: Camera, level: 78 },
  { name: 'Adobe Photoshop', logo: '/logos/photoshop.svg', level: 92 },
  { name: 'Adobe Illustrator', logo: '/logos/illustrator.svg', level: 60 },
  { name: 'Figma', logo: '/logos/figma.svg', level: 80 },
  { name: 'Adobe Lightroom', logo: '/logos/lightroom.svg', level: 75 },
];

export default function Skills() {
  return (
    <section className="skills section-padding" id="skills">
      <div className="container">
        <span className="section-eyebrow">What I Do</span>
        <h2 className="section-title">My Skills</h2>
        <p className="section-subtitle">
          A blend of creative and technical skills developed through academic study and real-world projects.
        </p>

        <div className="skills__grid">
          {skills.map((skill) => {
            const IconComponent = skill.icon;
            return (
              <div key={skill.name} className="skills__card">
                <div className="skills__icon">
                  {skill.logo ? (
                    <img src={skill.logo} alt={skill.name} className="skills__logo-img" />
                  ) : (
                    <IconComponent size={24} />
                  )}
                </div>
                <div className="skills__info">
                  <div className="skills__name-row">
                    <span className="skills__name">{skill.name}</span>
                    <span className="skills__percent">{skill.level}%</span>
                  </div>
                  <div className="skills__bar-bg">
                    <div
                      className="skills__bar-fill"
                      style={{ '--target-width': `${skill.level}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
