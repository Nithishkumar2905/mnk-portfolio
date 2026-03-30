import './About.css';

export default function About() {
  return (
    <section className="about section-padding" id="about">
      <div className="container about__inner">
        <div className="about__visual">
          <div className="about__img-container">
            <div className="about__img-placeholder">
              <img src="/about.jpg" alt="Nithish Kumar M" className="about__photo" />
            </div>
            <div className="about__experience-badge">
              <span className="about__exp-num">3+</span>
              <span className="about__exp-text">Years of<br />Design</span>
            </div>
          </div>
        </div>

        <div className="about__content">
          <span className="section-eyebrow">About Me</span>
          <h2 className="section-title">Designing With Purpose</h2>
          <p className="about__para">
            I'm <strong>Nithish Kumar M</strong>,a passionate graphic designer and UI/UX student with a strong
            foundation in visual storytelling and technology-driven design. I believe
            great design lies at the intersection of creativity and clarity—where aesthetics
            not only attract but also communicate purpose effectively.
          </p>
          <p className="about__para">
            With experience in graphic design, and UI/UX, I enjoy crafting visually
            compelling posters and building intuitive, user-centric digital experiences. My skill set
            extends into core IT domains, including web technologies.
          </p>
          <p className="about__para">
            When I'm not designing, you'll find me behind a camera lens — exploring the world one
            frame at a time. I am driven to create impactful, meaningful designs that seamlessly
            blend creativity with technology.
          </p>

          <div className="about__tags">
            {['Creative Thinker', 'Detail Oriented', 'Team Player', 'Fast Learner', 'Problem Solver'].map((tag) => (
              <span key={tag} className="about__tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
